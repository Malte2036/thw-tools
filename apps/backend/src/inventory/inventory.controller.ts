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
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import type { InventoryItem, Organisation, User } from '@prisma/client';
import { UpdateCustomDataSchema } from './dto/update-custom-data.dto';
import { GetUserAndOrgOrThrow } from '../shared/user-org/user-org.decorator';
import { InventoryService } from './inventory.service';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async findAll(
    @GetUserAndOrgOrThrow() [, organisation]: [User, Organisation],
  ): Promise<InventoryItem[]> {
    Logger.log('Getting inventory items');
    return this.inventoryService.findAllByOrganisation(organisation.id);
  }

  @Post('import/csv')
  @UseInterceptors(FileInterceptor('file'))
  async importInventoryViaCsv(
    @GetUserAndOrgOrThrow() [user, organisation]: [User, Organisation],
    @UploadedFile() file: Express.Multer.File,
  ) {
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
    Logger.log('Processed CSV data');
    return res;
  }

  @Patch(':id/custom-data')
  async updateCustomData(
    @GetUserAndOrgOrThrow() [user]: [User, Organisation],
    @Param('id') id: string,
    @Body() rawCustomData: unknown,
  ): Promise<InventoryItem> {
    if (!id) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
    }

    Logger.log(
      `Updating custom data for inventory item ${id} for user ${user.id}`,
    );

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
