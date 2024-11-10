import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { parse } from 'csv-parse';
import { z } from 'zod';
import {
  inventarNummerRegex,
  InventoryItem,
} from './schemas/inventory-item.schema';
import mongoose, { Model } from 'mongoose';
import { OrganisationDocument } from 'src/organisation/schemas/organisation.schema';

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
  constructor(
    @InjectModel(InventoryItem.name)
    private inventoryItemModel: Model<InventoryItem>,
  ) {}

  async getInventoryItems(organisationId: mongoose.Types.ObjectId) {
    return this.inventoryItemModel
      .find({
        organisation: organisationId,
      })
      .exec();
  }

  async getInventoryItemByInventarNummer(
    organisationId: mongoose.Types.ObjectId,
    inventarNummer: string,
  ) {
    return this.inventoryItemModel
      .findOne({
        organisation: organisationId,
        inventarNummer,
      })
      .exec();
  }

  async parseCsvData(
    organisation: OrganisationDocument,
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

          records.push(row as InventarCsvRow);
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
    organisation: OrganisationDocument,
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
    ) => {
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
          organisation: organisation,
          einheit,
          ebene: ebene,
          art: sanitizeValue(record.Art),
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
        } satisfies InventoryItem;
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
      .filter(Boolean);

    const einheiten = [...new Set(inventoryItems.map((item) => item.einheit))];
    Logger.debug(`Deleting existing inventory items for ${einheiten}`);
    await this.deleteAllInventoryItemsByEinheit(einheiten);

    Logger.debug(`Inserting ${inventoryItems.length} inventory`);
    await this.inventoryItemModel.insertMany(inventoryItems);

    return {
      count: inventoryItems.length,
      einheiten,
    };
  }

  deleteAllInventoryItemsByEinheit = async (einheit: string[]) => {
    return this.inventoryItemModel.deleteMany({ einheit: { $in: einheit } });
  };
}
