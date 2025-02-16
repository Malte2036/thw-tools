import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Organisation, InventoryItem, Prisma } from '@prisma/client';
import { UpdateCustomDataDto } from './dto/update-custom-data.dto';
import { z } from 'zod';
import { parse } from 'csv-parse';

// Format: XXXX-YYYYYY where X is 4 digits, Y is up to 6 digits/letters, optionally with an S prefix
export const inventarNummerRegex = /^\d{4}-(?:S)?\d{6}$/;

export const InventarCsvRowSchema = z.object({
  Ebene: z.string(),
  OE: z.string(),
  Art: z.string(),
  FB: z.string(),
  Menge: z.string(),
  'Menge Ist': z.string(),
  Verfügbar: z.string(),
  'Ausstattung | Hersteller | Typ': z.string(),
  Sachnummer: z.string(),
  'Inventar Nr': z.string(),
  'Gerätenr.': z.string(),
  Status: z.string(),
});

export type InventarCsvRow = z.infer<typeof InventarCsvRowSchema>;

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async parseCsvData(
    organisation: Organisation,
    file: Express.Multer.File,
  ): Promise<{
    count: number;
    einheiten: string[];
  }> {
    const records: InventarCsvRow[] = [];

    return await new Promise((resolve, reject) => {
      parse(file.buffer, {
        delimiter: ';',
        columns: true,
        encoding: 'latin1',
        relax_column_count: true,
        skip_empty_lines: true,
        skip_records_with_error: true,
      })
        .on('data', (row) => {
          const validationResult = InventarCsvRowSchema.safeParse(row);
          if (!validationResult.success) {
            Logger.warn(
              'Skipping invalid CSV row',
              validationResult.error,
              JSON.stringify(row),
            );
            return; // Skip this row instead of rejecting the entire process
          }

          records.push(validationResult.data);
        })
        .on('end', async () => {
          try {
            const res = await this.processCsvData(organisation, records);
            resolve(res);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async processCsvData(
    organisation: Organisation,
    records: InventarCsvRow[],
  ): Promise<{
    count: number;
    einheiten: string[];
  }> {
    const getKeyFromDelimitedString = (
      str: string,
      delimiter: string,
      index: number,
    ) => {
      const split = str.split(delimiter);
      if (split.length <= index) {
        return null;
      }

      return split[index].trim();
    };

    const sanitizeValue = (value: any) => {
      if (typeof value === 'string') {
        const res = value.trim();
        if (res.length === 0) {
          return null;
        }

        if (res.startsWith('-')) {
          return sanitizeValue(res.substring(1));
        }

        return res;
      }

      return value;
    };

    const csvRecordToInventoryItem = (
      record: InventarCsvRow,
      einheit: string,
    ): Prisma.InventoryItemCreateManyInput => {
      try {
        const ebene = parseInt(record.Ebene);
        if (isNaN(ebene)) {
          throw new Error(`Invalid number for Ebene: ${record.Ebene}`);
        }

        let inventarNummer = sanitizeValue(record['Inventar Nr']) ?? null;
        if (inventarNummer && !inventarNummer.match(inventarNummerRegex)) {
          Logger.debug(
            `Invalid Inventar Nr: ${inventarNummer}, setting to null`,
          );

          inventarNummer = null;
        }

        return {
          organisationId: organisation.id,
          einheit,
          ebene,
          art: sanitizeValue(record.Art),
          menge: sanitizeValue(record.Menge),
          mengeIst: sanitizeValue(record['Menge Ist']),
          verfuegbar: sanitizeValue(record.Verfügbar),
          ausstattung: sanitizeValue(
            getKeyFromDelimitedString(
              record['Ausstattung | Hersteller | Typ'],
              '|',
              0,
            ),
          ),
          hersteller: sanitizeValue(
            getKeyFromDelimitedString(
              record['Ausstattung | Hersteller | Typ'],
              '|',
              1,
            ),
          ),
          typ: sanitizeValue(
            getKeyFromDelimitedString(
              record['Ausstattung | Hersteller | Typ'],
              '|',
              2,
            ),
          ),
          inventarNummer,
          sachNummer: sanitizeValue(record.Sachnummer),
          gerateNummer: sanitizeValue(record['Gerätenr.']),
          status: sanitizeValue(record.Status),
        };
      } catch (error) {
        Logger.error(
          'Error while converting CSV record to InventoryItem',
          error,
          JSON.stringify(record),
        );
        return null;
      }
    };

    let einheit: string;
    const inventoryItems = records
      .map((record) => {
        if (record.Ebene === '') {
          einheit = record['Ausstattung | Hersteller | Typ'];
          Logger.debug(`Setting Einheit to ${einheit} for the next records`);
          return null;
        }
        return csvRecordToInventoryItem(record, einheit);
      })
      .filter(Boolean) as Prisma.InventoryItemCreateManyInput[];

    const einheiten = [...new Set(inventoryItems.map((item) => item.einheit))];
    Logger.debug(`Deleting existing inventory items for ${einheiten}`);
    await this.deleteAllInventoryItemsByEinheit(einheiten);

    Logger.debug(`Inserting ${inventoryItems.length} inventory`);
    await this.prisma.inventoryItem.createMany({
      data: inventoryItems,
    });

    return {
      count: inventoryItems.length,
      einheiten,
    };
  }

  deleteAllInventoryItemsByEinheit = async (einheit: string[]) => {
    return this.prisma.inventoryItem.deleteMany({
      where: { einheit: { in: einheit } },
    });
  };

  async findOneByOrganisation(
    id: string,
    organisationId: string,
  ): Promise<InventoryItem> {
    return this.prisma.inventoryItem.findFirst({
      where: { id, organisationId },
      include: {
        organisation: {
          select: {
            id: true,
          },
        },
        customData: true,
      },
    });
  }

  async findAllByOrganisation(
    organisationId: string,
  ): Promise<InventoryItem[]> {
    return this.prisma.inventoryItem.findMany({
      where: { organisationId },
      include: {
        organisation: {
          select: {
            id: true,
          },
        },
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
