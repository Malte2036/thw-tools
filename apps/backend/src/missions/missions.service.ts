import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { ScanMaterialDto } from './dto/scan-material.dto';
import { CreateManualMaterialDto } from './dto/create-manual-material.dto';
import { UpdateMaterialStatusDto } from './dto/update-material-status.dto';
import { MaterialStatus } from '@prisma/client/inventory';

@Injectable()
export class MissionsService {
  constructor(private prisma: PrismaService) {}

  async create(organisationId: string, createMissionDto: CreateMissionDto) {
    return this.prisma.mission.create({
      data: {
        ...createMissionDto,
        organisationId,
      },
    });
  }

  async findAllForOrg(organisationId: string) {
    return this.prisma.mission.findMany({
      where: { organisationId },
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(id: string, organisationId: string) {
    const mission = await this.prisma.mission.findFirst({
      where: { id, organisationId },
      include: {
        materials: {
          include: {
            inventoryItem: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!mission) {
      throw new NotFoundException(`Mission with ID ${id} not found.`);
    }
    return mission;
  }

  async scanMaterial(missionId: string, scanMaterialDto: ScanMaterialDto) {
    const { inventoryItemId } = scanMaterialDto;

    const existingMaterial = await this.prisma.missionMaterial.findFirst({
      where: {
        missionId,
        inventoryItemId,
        status: MaterialStatus.CHECKED_OUT,
      },
    });

    if (existingMaterial) {
      return { actionRequired: true, missionMaterialId: existingMaterial.id };
    }

    return this.prisma.missionMaterial.create({
      data: {
        missionId,
        inventoryItemId,
        status: MaterialStatus.CHECKED_OUT,
      },
      include: { inventoryItem: true },
    });
  }

  async createManualMaterial(
    missionId: string,
    createManualDto: CreateManualMaterialDto,
  ) {
    return this.prisma.missionMaterial.create({
      data: {
        missionId,
        manualName: createManualDto.name,
        manualQuantity: createManualDto.quantity,
        manualUnit: createManualDto.unit,
        status: MaterialStatus.CHECKED_OUT,
      },
    });
  }

  async updateMaterialStatus(
    materialId: string,
    updateDto: UpdateMaterialStatusDto,
  ) {
    const data: { status: MaterialStatus; returnedAt?: Date } = {
      status: updateDto.status,
    };

    if (
      updateDto.status === MaterialStatus.RETURNED ||
      updateDto.status === MaterialStatus.LOST ||
      updateDto.status === MaterialStatus.DEFECTIVE
    ) {
      data.returnedAt = new Date();
    }

    return this.prisma.missionMaterial.update({
      where: { id: materialId },
      data,
    });
  }

  async complete(id: string) {
    return this.prisma.mission.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        endDate: new Date(),
      },
    });
  }
}
