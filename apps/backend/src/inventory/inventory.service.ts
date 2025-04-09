import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Organisation, InventoryItem } from '@prisma/client';
import { UpdateCustomDataDto } from './dto/update-custom-data.dto';
import {
  ThwinCsvImportService,
  CsvImportResult,
} from './thwin-csv-import.service';
import { UserService } from '../user/user.service';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);
  constructor(
    private prisma: PrismaService,
    private csvImportService: ThwinCsvImportService,
  ) {}

  async parseCsvData(
    organisation: Organisation,
    file: Express.Multer.File,
  ): Promise<CsvImportResult> {
    const records = await this.csvImportService.parseCsvFile(file);
    const result = this.csvImportService.processRecords(organisation, records);

    this.logger.debug(
      `Deleting existing inventory items for ${result.einheiten}`,
    );
    await this.deleteAllInventoryItemsByEinheit(result.einheiten);

    this.logger.debug(`Inserting ${result.count} inventory items`);
    await this.prisma.inventoryItem.createMany({
      data: result.items,
    });

    return result;
  }

  deleteAllInventoryItemsByEinheit = async (einheit: string[]) => {
    return this.prisma.inventoryItem.deleteMany({
      where: { einheit: { in: einheit } },
    });
  };

  async findAllByOrganisation(
    organisationId: string,
  ): Promise<InventoryItem[]> {
    return this.prisma.inventoryItem.findMany({
      where: { organisationId },
      include: {
        customData: true,
      },
    });
  }

  async updateCustomData(
    id: string,
    updateCustomDataDto: UpdateCustomDataDto,
  ): Promise<InventoryItem> {
    const inventoryItem = await this.prisma.inventoryItem.findFirst({
      where: { id },
      include: {
        customData: true,
      },
    });

    if (!inventoryItem) {
      throw new HttpException('Inventory item not found', HttpStatus.NOT_FOUND);
    }

    if (!inventoryItem.customData) {
      // Create new custom data if it doesn't exist
      return this.prisma.inventoryItem.update({
        where: { id },
        data: {
          customData: {
            create: updateCustomDataDto,
          },
        },
        include: {
          customData: true,
        },
      });
    }

    // Update existing custom data
    return this.prisma.inventoryItem.update({
      where: { id },
      data: {
        customData: {
          update: updateCustomDataDto,
        },
      },
      include: {
        customData: true,
      },
    });
  }
}
