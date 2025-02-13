import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Body,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import mongoose from 'mongoose';

import { getUserAndOrgFromRequestAndThrow } from 'src/funk/funk.controller';
import { OrganisationService } from 'src/organisation/organisation.service';
import { UserService } from 'src/user/user.service';
import { InventoryService } from './inventory.service';
import { Request } from 'express';
import { InventoryItemCustomData } from './schemas/inventory-item-custom-data.schema';
import {
  UpdateCustomDataDto,
  UpdateCustomDataSchema,
} from './dto/update-custom-data.dto';

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

  @Get(':id')
  async getInventoryItem(@Req() req: Request, @Param('id') id: string) {
    const [, organisation] = await getUserAndOrgFromRequestAndThrow(
      req,
      this.userService,
      this.organisationService,
    );

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
    }

    Logger.log(`Getting inventory item by ID: ${id}`);

    const item = await this.inventoryService.getInventoryItemById(
      organisation._id,
      new mongoose.Types.ObjectId(id),
    );

    if (!item) {
      throw new HttpException('Inventory item not found', HttpStatus.NOT_FOUND);
    }

    return item;
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
      Logger.error(`Invalid file type provided: ${file.mimetype}`);
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

  @Patch(':id/custom-data')
  async updateCustomData(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() rawCustomData: unknown,
  ) {
    const [, organisation] = await getUserAndOrgFromRequestAndThrow(
      req,
      this.userService,
      this.organisationService,
    );

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
    }

    Logger.log(`Updating custom data for inventory item by ID: ${id}`);

    const validationResult = UpdateCustomDataSchema.safeParse(rawCustomData);
    if (!validationResult.success) {
      throw new HttpException(
        {
          message: 'Invalid custom data format',
          errors: validationResult.error.errors,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const item = await this.inventoryService.getInventoryItemById(
      organisation._id,
      new mongoose.Types.ObjectId(id),
    );

    if (!item) {
      throw new HttpException('Inventory item not found', HttpStatus.NOT_FOUND);
    }

    const updatedCustomData = await this.inventoryService.updateCustomData(
      item._id,
      validationResult.data,
    );

    return {
      _id: item._id,
      customData: updatedCustomData,
    };
  }
}
