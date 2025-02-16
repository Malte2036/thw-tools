import { Injectable, Logger } from '@nestjs/common';
import { Organisation, Prisma } from '@prisma/client';
import { z } from 'zod';
import { parse } from 'csv-parse';

// Format: XXXX-YYYYYY where X is 4 digits, Y is up to 6 digits/letters, optionally with an S prefix
export const inventarNummerRegex = /^\d{4}-(?:S)?\d{6}$/;

const transformString = (val: string | null | undefined) =>
  val?.trim() === '' || !val ? null : val.trim();

const transformNumber = (val: string | null | undefined) => {
  if (!val || val.trim() === '') return null;
  // Replace German number format
  const normalized = val.trim().replace(',', '.');
  const num = parseFloat(normalized);
  return isNaN(num) ? null : num;
};

const transformInteger = (val: string | null | undefined) => {
  if (!val || val.trim() === '') return null;
  const num = parseInt(val.trim());
  return isNaN(num) ? null : num;
};

export const InventarCsvRowSchema = z.object({
  Ebene: z.string().transform(transformInteger).nullable(),
  OE: z.string().transform(transformString),
  Art: z.string().transform(transformString),
  FB: z.string().transform(transformString),
  Menge: z.string().transform(transformNumber),
  'Menge Ist': z.string().transform(transformNumber),
  Verfügbar: z.string().transform(transformNumber),
  'Ausstattung | Hersteller | Typ': z.string().transform(transformString),
  Sachnummer: z.string().transform(transformString),
  'Inventar Nr': z.string().transform(transformString),
  'Gerätenr.': z.string().transform(transformString),
  Status: z.string().transform(transformString),
});

export type InventarCsvRow = z.infer<typeof InventarCsvRowSchema>;

export interface CsvImportResult {
  count: number;
  einheiten: string[];
  items: Prisma.InventoryItemCreateManyInput[];
}

@Injectable()
export class CsvImportService {
  async parseCsvFile(file: Express.Multer.File): Promise<InventarCsvRow[]> {
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
        .on('end', () => resolve(records))
        .on('error', (error) => reject(error));
    });
  }

  processRecords(
    organisation: Organisation,
    records: InventarCsvRow[],
  ): CsvImportResult {
    let currentEinheit: string | null = null;
    const inventoryItems = records
      .map((record): Prisma.InventoryItemCreateManyInput | null => {
        // If Ebene is null, this is a header row containing the Einheit
        if (record.Ebene === null) {
          currentEinheit = record['Ausstattung | Hersteller | Typ'];
          Logger.debug(
            `Setting Einheit to ${currentEinheit} for the next records`,
          );
          return null;
        }

        if (!currentEinheit) {
          Logger.warn('Skipping record because no Einheit is set', record);
          return null;
        }

        try {
          const ausstattungParts =
            record['Ausstattung | Hersteller | Typ']
              ?.split('|')
              .map(transformString) ?? [];

          return {
            organisationId: organisation.id,
            einheit: currentEinheit,
            ebene: record.Ebene,
            art: record.Art,
            menge: record.Menge,
            mengeIst: record['Menge Ist'],
            verfuegbar: record.Verfügbar,
            ausstattung: ausstattungParts[0] ?? null,
            hersteller: ausstattungParts[1] ?? null,
            typ: ausstattungParts[2] ?? null,
            inventarNummer: record['Inventar Nr']?.match(inventarNummerRegex)
              ? record['Inventar Nr']
              : null,
            sachNummer: record.Sachnummer,
            gerateNummer: record['Gerätenr.'],
            status: record.Status,
          };
        } catch (error) {
          Logger.error(
            'Error while converting CSV record to InventoryItem',
            error,
            JSON.stringify(record),
          );
          return null;
        }
      })
      .filter(Boolean) as Prisma.InventoryItemCreateManyInput[];

    const einheiten = [...new Set(inventoryItems.map((item) => item.einheit))];

    return {
      count: inventoryItems.length,
      einheiten,
      items: inventoryItems,
    };
  }
}
