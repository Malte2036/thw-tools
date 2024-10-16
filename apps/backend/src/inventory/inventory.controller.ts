import {
  Body,
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

import { InventoryService } from './inventory.service';
import { getUserAndOrgFromRequestAndThrow } from 'src/funk/funk.controller';
import { OrganisationService } from 'src/organisation/organisation.service';
import { UserService } from 'src/user/user.service';
import { z } from 'zod';

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
    @Body() body: { einheit: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const [user, organisation] = await getUserAndOrgFromRequestAndThrow(
      req,
      this.userService,
      this.organisationService,
    );

    const einheitParsed = z.string().safeParse(body.einheit);
    if (!einheitParsed.success) {
      throw new HttpException(
        'Einheit is not a valid string',
        HttpStatus.BAD_REQUEST,
      );
    }

    const einheit = einheitParsed.data;

    Logger.log(
      `User ${user.id} is importing inventory for ${einheit}, with file ${file.originalname}`,
    );
    this.inventoryService.parseCsvData(organisation, einheit, file);
    Logger.log('File processed');
  }
}
