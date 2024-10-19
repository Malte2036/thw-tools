import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { getUserAndOrgFromRequestAndThrow } from 'src/funk/funk.controller';
import { OrganisationService } from 'src/organisation/organisation.service';
import { UserService } from 'src/user/user.service';
import { InventoryService } from './inventory.service';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly userService: UserService,
    private readonly organisationService: OrganisationService,
    private readonly inventoryService: InventoryService,
  ) {}

  @Get()
  async getInventoryItems(@Req() req: Request) {
    const [, organisation] = await getUserAndOrgFromRequestAndThrow(
      req,
      this.userService,
      this.organisationService,
    );

    Logger.log('Getting inventory items');
    return this.inventoryService.getInventoryItems(organisation._id);
  }

  @Get('inventarNummer/:inventarNummer')
  async getInventoryItemByInventarNumber(
    @Req() req: Request,
    @Param('inventarNummer') inventarNummer: string,
  ) {
    const [, organisation] = await getUserAndOrgFromRequestAndThrow(
      req,
      this.userService,
      this.organisationService,
    );

    Logger.log(`Getting inventory item by inventarNummer: ${inventarNummer}`);

    return this.inventoryService.getInventoryItemByInventarNummer(
      organisation._id,
      inventarNummer,
    );
  }

  @Post('import/csv')
  @UseInterceptors(FileInterceptor('file'))
  async importInventoryViaCsv(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const [user, organisation] = await getUserAndOrgFromRequestAndThrow(
      req,
      this.userService,
      this.organisationService,
    );

    if (!file) {
      Logger.error('No file provided');
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    if (file.mimetype !== 'text/csv') {
      Logger.error('Invalid file type provided');
      throw new HttpException(
        'Only CSV files are allowed',
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      );
    }

    Logger.log(
      `User ${user.id} is importing inventory, with file ${file.originalname}`,
    );

    const res = await this.inventoryService.parseCsvData(organisation, file);
    Logger.log('Processed CSV data', res);
    return res;
  }
}
