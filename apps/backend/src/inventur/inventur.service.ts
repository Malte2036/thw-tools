import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventurSessionDto } from './dto/create-inventur-session.dto';
import { AddItemDto } from './dto/add-item.dto';
import { SetItemCountDto } from './dto/set-item-count.dto';
import { Prisma, InventurItemEntry } from '@prisma/client';

@Injectable()
export class InventurService {
  private readonly logger = new Logger(InventurService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new inventur session for an organisation
   */
  async createSession(
    organisationId: string,
    userId: string,
    createDto: CreateInventurSessionDto,
  ): Promise<any> {
    this.logger.log(
      `Creating new inventur session for organisation ${organisationId} by user ${userId}`,
    );

    // Create the session
    const newSession = await this.prisma.inventurSession.create({
      data: {
        organisationId,
        einheit: createDto.einheit,
      },
    });

    // Add the creator as a participant
    await this.prisma.inventurSessionParticipant.create({
      data: {
        inventurSessionId: newSession.id,
        userId,
      },
    });

    // Return the session with its participants
    const sessionWithParticipants =
      await this.prisma.inventurSession.findUnique({
        where: { id: newSession.id },
        include: {
          participants: true,
        },
      });

    this.logger.log(`Created inventur session with ID ${newSession.id}`);
    return sessionWithParticipants;
  }

  /**
   * Adds or updates an item entry for a scanned inventarNummer within an inventur session.
   */
  async addItemToSession(
    sessionId: string,
    addItemDto: AddItemDto,
  ): Promise<InventurItemEntry> {
    const { inventarNummer } = addItemDto;
    this.logger.debug(
      `Upserting item by inventarNummer ${inventarNummer} for session ${sessionId}`,
    );

    return this.prisma.$transaction(async (tx) => {
      const session = await tx.inventurSession.findUnique({
        where: { id: sessionId },
        select: { organisationId: true, status: true },
      });

      if (!session) {
        throw new NotFoundException(
          `Inventur session with ID ${sessionId} not found.`,
        );
      }

      if (session.status !== 'running') {
        throw new BadRequestException(
          `Inventur session ${sessionId} is not running.`,
        );
      }

      const item = await tx.inventoryItem.findFirst({
        where: {
          inventarNummer: inventarNummer,
          organisationId: session.organisationId,
        },
        select: { id: true },
      });

      if (!item) {
        throw new BadRequestException(
          `Item with InventarNummer ${inventarNummer} not found in organisation.`,
        );
      }

      const inventarItemId = item.id;

      const updatedEntry = await tx.inventurItemEntry.upsert({
        where: {
          inventurSessionId_inventarItemId: {
            inventurSessionId: sessionId,
            inventarItemId: inventarItemId,
          },
        },
        update: {
          scannedCount: { increment: 1 },
        },
        create: {
          inventurSessionId: sessionId,
          inventarItemId: inventarItemId,
          scannedCount: 1,
        },
        select: {
          id: true,
          inventurSessionId: true,
          inventarItemId: true,
          scannedCount: true,
          note: true,
        },
      });

      this.logger.log(
        `Upserted entry for item ${inventarNummer} (ID: ${inventarItemId}) in session ${sessionId}. New count: ${updatedEntry.scannedCount}`,
      );
      return updatedEntry;
    });
  }

  /**
   * Gets details of a specific inventur session, including its items.
   */
  async getSessionDetails(sessionId: string): Promise<any> {
    this.logger.debug(`Getting details for inventur session ${sessionId}`);
    const session = await this.prisma.inventurSession.findUnique({
      where: { id: sessionId },
      include: {
        participants: { include: { user: true } },
        items: { include: { inventarItem: true } },
      },
    });

    if (!session) {
      throw new NotFoundException(
        `Inventur session with ID ${sessionId} not found.`,
      );
    }
    return session;
  }

  /**
   * Sets the count for a specific item entry within an inventur session.
   * Includes validation.
   */
  async setItemCount(
    sessionId: string,
    setItemCountDto: SetItemCountDto,
  ): Promise<InventurItemEntry> {
    const { inventarItemId, count } = setItemCountDto;
    this.logger.debug(
      `Setting count for item ${inventarItemId} to ${count} in session ${sessionId}`,
    );

    return this.prisma.$transaction(async (tx) => {
      const session = await tx.inventurSession.findUnique({
        where: { id: sessionId },
        select: { organisationId: true, status: true },
      });

      if (!session || session.status !== 'running') {
        throw new NotFoundException(
          `Inventur session with ID ${sessionId} not found or not running.`,
        );
      }

      const item = await tx.inventoryItem.findUnique({
        where: {
          id: inventarItemId,
          organisationId: session.organisationId,
        },
      });

      if (!item) {
        throw new BadRequestException(
          `Item with ID ${inventarItemId} not found in organisation.`,
        );
      }

      const updatedEntry = await tx.inventurItemEntry.upsert({
        where: {
          inventurSessionId_inventarItemId: {
            inventurSessionId: sessionId,
            inventarItemId: inventarItemId,
          },
        },
        update: {
          scannedCount: count,
        },
        create: {
          inventurSessionId: sessionId,
          inventarItemId: inventarItemId,
          scannedCount: count,
        },
        select: {
          id: true,
          inventurSessionId: true,
          inventarItemId: true,
          scannedCount: true,
          note: true,
        },
      });

      this.logger.log(
        `Set count for item ${inventarItemId} to ${count} in session ${sessionId}.`,
      );
      return updatedEntry;
    });
  }
}
