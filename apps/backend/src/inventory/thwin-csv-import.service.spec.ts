import { Test, TestingModule } from '@nestjs/testing';
import {
  InventarCsvRow,
  ThwinCsvImportService,
} from './thwin-csv-import.service';
import { Organisation } from '@prisma/client';

describe('ThwinCsvImportService', () => {
  let service: ThwinCsvImportService;
  const mockOrganisation: Organisation = {
    id: '1',
  } as Organisation;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThwinCsvImportService],
    }).compile();

    service = module.get(ThwinCsvImportService);
  });

  describe('parseCsvFile', () => {
    it('should parse a valid CSV file', async () => {
      const csvContent = `"Ebene";"OE";"Art";"FB";"Menge";"Menge Ist";"Verfügbar";"Ausstattung | Hersteller | Typ";"Sachnummer";"Inventar Nr";"Gerätenr.";"Status"
;"Test OV";"";"";"";"";"";"Test Einheit 1";"";"";"";"V"
1;"";"";"";"";"";"";"Test Einheit 2";"";"";"";"V"
2;"";"Test";"";"0";"0";"0";"Test Item | Test Brand | Test Type";"1234T56789";"---------------";"--------------------";"F"
3;"Test OV";"Test";"FB1";"10";"8";"7";"Full Item | Full Brand | Full Type";"5678T12345";"1234-123456";"DEV123456";"V"`;

      const mockFile = {
        buffer: Buffer.from(csvContent, 'latin1'),
        fieldname: 'file',
        originalname: 'test.csv',
        encoding: '7bit',
        mimetype: 'text/csv',
        size: csvContent.length,
        stream: null,
        destination: '',
        filename: 'test.csv',
        path: '/tmp/test.csv',
      } as Express.Multer.File;

      const result = await service.parseCsvFile(mockFile);

      expect(result).toBeDefined();
      expect(result.length).toBe(4);
      expect(result[0]).toMatchObject({
        OE: 'Test OV',
        Ebene: null,
        Art: null,
        FB: null,
        Menge: null,
      });
      expect(result[1]).toMatchObject({
        OE: null,
        Ebene: 1,
        Art: null,
        FB: null,
        Menge: null,
      });
      expect(result[2]).toMatchObject({
        OE: null,
        Ebene: 2,
        Art: 'Test',
        FB: null,
        Menge: 0,
      });
      expect(result[3]).toMatchObject({
        OE: 'Test OV',
        Ebene: 3,
        Art: 'Test',
        FB: 'FB1',
        Menge: 10,
        'Menge Ist': 8,
        Verfügbar: 7,
        'Ausstattung | Hersteller | Typ': 'Full Item | Full Brand | Full Type',
        Sachnummer: '5678T12345',
        'Inventar Nr': '1234-123456',
        'Gerätenr.': 'DEV123456',
        Status: 'V',
      });
    });

    it('should handle empty values and convert them to null', async () => {
      const csvContent = `"Ebene";"OE";"Art";"FB";"Menge";"Menge Ist";"Verfügbar";"Ausstattung | Hersteller | Typ";"Sachnummer";"Inventar Nr";"Gerätenr.";"Status"
2;"";"Test";"";"";"0";"0";"Test Item | Test Brand | Test Type";"1234T56789";"1234-123456";"--------------------";"F"`;

      const mockFile = {
        buffer: Buffer.from(csvContent, 'latin1'),
        fieldname: 'file',
        originalname: 'test.csv',
        encoding: '7bit',
        mimetype: 'text/csv',
        size: csvContent.length,
        stream: null,
        destination: '',
        filename: 'test.csv',
        path: '/tmp/test.csv',
      } as Express.Multer.File;

      const result = await service.parseCsvFile(mockFile);

      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0].FB).toBeNull();
      expect(result[0].Menge).toBeNull();
      expect(result[0]['Inventar Nr']).toBe('1234-123456');
    });

    it('should handle malformed CSV data', async () => {
      const csvContent = `"Ebene";"OE";"Art";"FB";"Menge";"Menge Ist";"Verfügbar";"Ausstattung | Hersteller | Typ";"Sachnummer";"Inventar Nr";"Gerätenr.";"Status"
invalid;data;format`;

      const mockFile = {
        buffer: Buffer.from(csvContent, 'latin1'),
        fieldname: 'file',
        originalname: 'test.csv',
        encoding: '7bit',
        mimetype: 'text/csv',
        size: csvContent.length,
        stream: null,
        destination: '',
        filename: 'test.csv',
        path: '/tmp/test.csv',
      } as Express.Multer.File;

      const result = await service.parseCsvFile(mockFile);

      expect(result).toBeDefined();
      expect(result).toHaveLength(0);
    });

    it('should handle German number format', async () => {
      const csvContent = `"Ebene";"OE";"Art";"FB";"Menge";"Menge Ist";"Verfügbar";"Ausstattung | Hersteller | Typ";"Sachnummer";"Inventar Nr";"Gerätenr.";"Status"
2;"";"Test";"";"1,5";"1,5";"1,5";"Test Item | Test Brand | Test Type";"1234T56789";"1234-123456";"--------------------";"F"`;

      const mockFile = {
        buffer: Buffer.from(csvContent, 'latin1'),
        fieldname: 'file',
        originalname: 'test.csv',
        encoding: '7bit',
        mimetype: 'text/csv',
        size: csvContent.length,
        stream: null,
        destination: '',
        filename: 'test.csv',
        path: '/tmp/test.csv',
      } as Express.Multer.File;

      const result = await service.parseCsvFile(mockFile);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].Menge).toBe(1.5);
      expect(result[0]['Menge Ist']).toBe(1.5);
      expect(result[0].Verfügbar).toBe(1.5);
    });
  });

  describe('processRecords', () => {
    it('should process records and set einheit correctly', () => {
      const records = [
        {
          Ebene: null,
          OE: '',
          Art: '',
          FB: null,
          Menge: null,
          'Menge Ist': null,
          Verfügbar: null,
          'Ausstattung | Hersteller | Typ': 'Test Einheit 1',
          Sachnummer: null,
          'Inventar Nr': null,
          'Gerätenr.': null,
          Status: 'V',
        },
        {
          Ebene: 2,
          OE: '',
          Art: 'Test',
          FB: null,
          Menge: 1,
          'Menge Ist': 1,
          Verfügbar: 1,
          'Ausstattung | Hersteller | Typ':
            'Test Item | Test Brand | Test Type',
          Sachnummer: '1234T56789',
          'Inventar Nr': '1234-123456',
          'Gerätenr.': null,
          Status: 'F',
        },
      ];

      const result = service.processRecords(mockOrganisation, records);

      expect(result.count).toBe(1);
      expect(result.einheiten).toEqual(['Test Einheit 1']);
      expect(result.items[0]).toMatchObject({
        organisationId: mockOrganisation.id,
        einheit: 'Test Einheit 1',
        ebene: 2,
        art: 'Test',
        menge: 1,
        mengeIst: 1,
        verfuegbar: 1,
        ausstattung: 'Test Item',
        hersteller: 'Test Brand',
        typ: 'Test Type',
        inventarNummer: '1234-123456',
        sachNummer: '1234T56789',
        status: 'F',
      });
    });

    it('should handle invalid inventory numbers', () => {
      const records = [
        {
          Ebene: null,
          OE: '',
          Art: '',
          FB: null,
          Menge: null,
          'Menge Ist': null,
          Verfügbar: null,
          'Ausstattung | Hersteller | Typ': 'Test Einheit 1',
          Sachnummer: null,
          'Inventar Nr': null,
          'Gerätenr.': null,
          Status: 'V',
        },
        {
          Ebene: 2,
          OE: '',
          Art: 'Test',
          FB: null,
          Menge: 1,
          'Menge Ist': 1,
          Verfügbar: 1,
          'Ausstattung | Hersteller | Typ':
            'Test Item | Test Brand | Test Type',
          Sachnummer: '1234T56789',
          'Inventar Nr': 'INVALID-NUMBER',
          'Gerätenr.': null,
          Status: 'F',
        },
      ];

      const result = service.processRecords(mockOrganisation, records);

      expect(result.items[0].inventarNummer).toBeNull();
    });

    it('should skip records without einheit', () => {
      const records = [
        {
          Ebene: 2,
          OE: '',
          Art: 'Test',
          FB: null,
          Menge: 1,
          'Menge Ist': 1,
          Verfügbar: 1,
          'Ausstattung | Hersteller | Typ':
            'Test Item | Test Brand | Test Type',
          Sachnummer: '1234T56789',
          'Inventar Nr': '1234-123456',
          'Gerätenr.': null,
          Status: 'F',
        },
      ];

      const result = service.processRecords(mockOrganisation, records);

      expect(result.count).toBe(0);
      expect(result.items).toHaveLength(0);
    });

    it('should handle multiple einheit changes', () => {
      const records = [
        {
          Ebene: null,
          OE: '',
          Art: '',
          FB: null,
          Menge: null,
          'Menge Ist': null,
          Verfügbar: null,
          'Ausstattung | Hersteller | Typ': 'Test Einheit 1',
          Sachnummer: null,
          'Inventar Nr': null,
          'Gerätenr.': null,
          Status: 'V',
        },
        {
          Ebene: 2,
          OE: '',
          Art: 'Test',
          FB: null,
          Menge: 1,
          'Menge Ist': 1,
          Verfügbar: 1,
          'Ausstattung | Hersteller | Typ': 'Test Item 1 | Brand 1 | Type 1',
          Sachnummer: '1234T56789',
          'Inventar Nr': '1234-123456',
          'Gerätenr.': null,
          Status: 'F',
        },
        {
          Ebene: null,
          OE: '',
          Art: '',
          FB: null,
          Menge: null,
          'Menge Ist': null,
          Verfügbar: null,
          'Ausstattung | Hersteller | Typ': 'Test Einheit 2',
          Sachnummer: null,
          'Inventar Nr': null,
          'Gerätenr.': null,
          Status: 'V',
        },
        {
          Ebene: 2,
          OE: '',
          Art: 'Test',
          FB: null,
          Menge: 1,
          'Menge Ist': 1,
          Verfügbar: 1,
          'Ausstattung | Hersteller | Typ': 'Test Item 2 | Brand 2 | Type 2',
          Sachnummer: '9876T54321',
          'Inventar Nr': '9876-654321',
          'Gerätenr.': null,
          Status: 'F',
        },
      ];

      const result = service.processRecords(mockOrganisation, records);

      expect(result.count).toBe(2);
      expect(result.einheiten).toEqual(['Test Einheit 1', 'Test Einheit 2']);
      expect(result.items[0].einheit).toBe('Test Einheit 1');
      expect(result.items[1].einheit).toBe('Test Einheit 2');
    });

    it('should handle equipment with missing manufacturer or type', () => {
      const records = [
        {
          Ebene: null,
          OE: '',
          Art: '',
          FB: null,
          Menge: null,
          'Menge Ist': null,
          Verfügbar: null,
          'Ausstattung | Hersteller | Typ': 'Test Einheit 1',
          Sachnummer: null,
          'Inventar Nr': null,
          'Gerätenr.': null,
          Status: 'V',
        },
        {
          Ebene: 2,
          OE: '',
          Art: 'Test',
          FB: null,
          Menge: 1,
          'Menge Ist': 1,
          Verfügbar: 1,
          'Ausstattung | Hersteller | Typ': 'Test Item 1',
          Sachnummer: '1234T56789',
          'Inventar Nr': '1234-123456',
          'Gerätenr.': null,
          Status: 'F',
        },
      ];

      const result = service.processRecords(mockOrganisation, records);

      expect(result.count).toBe(1);
      expect(result.items[0].ausstattung).toBe('Test Item 1');
      expect(result.items[0].hersteller).toBeNull();
      expect(result.items[0].typ).toBeNull();
    });

    it('should handle special inventory number format with S prefix', () => {
      const records = [
        {
          Ebene: null,
          OE: '',
          Art: '',
          FB: null,
          Menge: null,
          'Menge Ist': null,
          Verfügbar: null,
          'Ausstattung | Hersteller | Typ': 'Test Einheit 1',
          Sachnummer: null,
          'Inventar Nr': null,
          'Gerätenr.': null,
          Status: 'V',
        },
        {
          Ebene: 2,
          OE: '',
          Art: 'Test',
          FB: null,
          Menge: 1,
          'Menge Ist': 1,
          Verfügbar: 1,
          'Ausstattung | Hersteller | Typ':
            'Test Item | Test Brand | Test Type',
          Sachnummer: '1234T56789',
          'Inventar Nr': '1234-S123456',
          'Gerätenr.': null,
          Status: 'F',
        },
      ];

      const result = service.processRecords(mockOrganisation, records);

      expect(result.count).toBe(1);
      expect(result.items[0].inventarNummer).toBe('1234-S123456');
    });
  });
});
