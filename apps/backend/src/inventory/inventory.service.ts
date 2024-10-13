import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { parse } from 'csv-parse';
import { z } from 'zod';
import {
  inventarNummerRegex,
  InventoryItem,
} from './schemas/inventory-item.schema';
import { Model } from 'mongoose';
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

  async parseCsvData(
    organisation: OrganisationDocument,
    file: Express.Multer.File,
  ) {
    const records: InventarCsvRow[] = [];

    await new Promise((resolve, reject) => {
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
            await this.processCsvData(organisation, records);
            resolve({ message: 'CSV file processed successfully' });
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });

    Logger.log(`Processed ${records.length} CSV rows`);
  }

  async processCsvData(
    organisation: OrganisationDocument,
    records: InventarCsvRow[],
  ) {
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
        if (res === '') {
          return null;
        }
        return res;
      }

      return value;
    };

    const csvRecordToInventoryItem = (record: InventarCsvRow) => {
      try {
        const ebene = parseInt(record.Ebene);
        if (isNaN(ebene)) {
          throw new Error(`Invalid number for Ebene: ${record.Ebene}`);
        }

        let inventarNummer = sanitizeValue(record['Inventar Nr']) ?? '';
        if (!inventarNummer.match(inventarNummerRegex)) {
          Logger.debug(
            `Invalid Inventar Nr: ${inventarNummer}, setting to null`,
          );

          inventarNummer = null;
        }

        return {
          organisation: organisation,
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

    console.log(records);

    await this.inventoryItemModel.insertMany(
      records.map((record) => csvRecordToInventoryItem(record)).filter(Boolean),
    );
  }
}
