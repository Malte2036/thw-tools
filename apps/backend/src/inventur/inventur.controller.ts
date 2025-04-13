import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import {
  CreateInventurSessionDto,
  CreateInventurSessionSchema,
} from './dto/create-inventur-session.dto';
import { InventurService } from './inventur.service';
import { EnsureUserAndOrgGuard } from '../shared/user-org/ensure-user-org.guard';
import {
  ValidateItemQueryDto,
  ValidateItemQuerySchema,
} from './dto/validate-item-query.dto';
import { AddItemDto, AddItemSchema } from './dto/add-item.dto';
import { SetItemCountDto, SetItemCountSchema } from './dto/set-item-count.dto';

@ApiTags('inventur')
@Controller('inventur/sessions')
export class InventurController {
  private readonly logger = new Logger(InventurController.name);

  constructor(private readonly inventurService: InventurService) {}

  @Post()
  @UseGuards(EnsureUserAndOrgGuard)
  async createSession(@Req() req: Request, @Body() rawCreateDto: unknown) {
    this.logger.log('Creating new inventur session');

    // Validate the request body
    const validation = CreateInventurSessionSchema.safeParse(rawCreateDto);
    if (!validation.success) {
      throw new HttpException(
        {
          message: 'Invalid input format',
          errors: validation.error.errors,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const createDto: CreateInventurSessionDto = validation.data;
      const session = await this.inventurService.createSession(
        req.organisation.id,
        req.user.id,
        createDto,
      );

      return session;
    } catch (error) {
      this.logger.error(`Error creating inventur session: ${error.message}`);
      throw new HttpException(
        'Error creating inventur session',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':sessionId/items')
  @UseGuards(EnsureUserAndOrgGuard)
  async addItemToSession(
    @Req() req: Request,
    @Param('sessionId') sessionId: string,
    @Body() rawAddItemDto: unknown,
  ) {
    this.logger.debug(`Received add item request for session ${sessionId}`);

    // Validate body using the updated AddItemSchema
    const bodyValidation = AddItemSchema.safeParse(rawAddItemDto);
    if (!bodyValidation.success) {
      throw new HttpException(
        {
          message: 'Invalid request body format',
          errors: bodyValidation.error.errors,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const addItemDto: AddItemDto = bodyValidation.data;

    try {
      // TODO: Add finer-grained check: Does the requesting user belong to *this specific session*?
      const result = await this.inventurService.addItemToSession(
        sessionId,
        addItemDto,
      );
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // Re-throw known HTTP exceptions (like NotFoundException/BadRequest from service)
      }
      this.logger.error(
        `Error adding item to session ${sessionId}: ${error.message}`,
      );
      throw new HttpException(
        'Error adding item to session',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':sessionId')
  @UseGuards(EnsureUserAndOrgGuard)
  async getSessionDetails(
    @Req() req: Request,
    @Param('sessionId') sessionId: string,
  ) {
    this.logger.debug(`Getting details for session ${sessionId}`);
    try {
      // TODO: Add permission check: Does req.user belong to this session's organisation/participants?
      const result = await this.inventurService.getSessionDetails(sessionId);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Error getting session details ${sessionId}: ${error.message}`,
      );
      throw new HttpException(
        'Error retrieving session details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':sessionId/items/:inventarItemId')
  @UseGuards(EnsureUserAndOrgGuard)
  async setItemCount(
    @Req() req: Request,
    @Param('sessionId') sessionId: string,
    @Param('inventarItemId') inventarItemId: string,
    @Body() rawSetCountDto: { count: number },
  ) {
    this.logger.debug(
      `Received set count request for item ${inventarItemId} in session ${sessionId}`,
    );

    const dtoToValidate: SetItemCountDto = {
      inventarItemId: inventarItemId,
      count: rawSetCountDto.count,
    };

    const validation = SetItemCountSchema.safeParse(dtoToValidate);
    if (!validation.success) {
      throw new HttpException(
        { message: 'Invalid input', errors: validation.error.errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.inventurService.setItemCount(
        sessionId,
        validation.data,
      );
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Error setting count for item ${inventarItemId} in session ${sessionId}: ${error.message}`,
      );
      throw new HttpException(
        'Error setting item count',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
