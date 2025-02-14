import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { InventoryService } from './inventory.service';
import { InventoryItem } from './entities/inventory-item.entity';
import { InventoryItemCustomData } from './entities/inventory-item-custom-data.entity';
import {
  UpdateCustomDataDto,
  UpdateCustomDataSchema,
} from './dto/update-custom-data.dto';
import { getUserAndOrgFromRequestAndThrow } from 'src/funk/funk.controller';
import { UserService } from 'src/user/user.service';
import { OrganisationService } from 'src/organisation/organisation.service';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly userService: UserService,
    private readonly organisationService: OrganisationService,
  ) {}

  @Get()
  async findAll(@Req() req: Request): Promise<InventoryItem[]> {
    const [, organisation] = await getUserAndOrgFromRequestAndThrow(
      req,
      this.userService,
      this.organisationService,
    );
    Logger.log('Getting inventory items');
    return this.inventoryService.findAllByOrganisation(organisation.id);
  }

  @Get(':id')
  async findOne(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<InventoryItem> {
    const [, organisation] = await getUserAndOrgFromRequestAndThrow(
      req,
      this.userService,
      this.organisationService,
    );

    if (!id) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
    }

    Logger.log(`Getting inventory item by ID: ${id}`);
    const item = await this.inventoryService.findOneByOrganisation(
      id,
      organisation.id,
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
  ): Promise<{ id: string; customData: InventoryItemCustomData }> {
    const [, organisation] = await getUserAndOrgFromRequestAndThrow(
      req,
      this.userService,
      this.organisationService,
    );

    if (!id) {
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

    const updatedItem = await this.inventoryService.updateCustomData(
      id,
      validationResult.data,
    );

    return updatedItem;
  }
}
