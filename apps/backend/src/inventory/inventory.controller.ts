import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import type { InventoryItem } from '@prisma/client';
import { UpdateCustomDataSchema } from './dto/update-custom-data.dto';
import { InventoryService } from './inventory.service';
import { EnsureUserAndOrgGuard } from '../shared/user-org/ensure-user-org.guard';
import { Request } from 'express';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  private readonly logger = new Logger(InventoryController.name);
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @UseGuards(EnsureUserAndOrgGuard)
  async findAll(@Req() req: Request) {
    this.logger.log('Getting inventory items');
    return this.inventoryService.findAllByOrganisation(req.organisation.id);
  }

  @Post('import/csv')
  @UseGuards(EnsureUserAndOrgGuard)
  @UseInterceptors(FileInterceptor('file'))
  async importInventoryViaCsv(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      this.logger.error('No file provided');
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    if (file.mimetype !== 'text/csv') {
      this.logger.error(`Invalid file type provided: ${file.mimetype}`);
      throw new HttpException(
        'Only CSV files are allowed',
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      );
    }

    this.logger.log(
      `User ${req.user.id} is importing inventory, with file ${file.originalname}`,
    );

    const res = await this.inventoryService.parseCsvData(
      req.organisation,
      file,
    );
    this.logger.log('Processed CSV data');
    return res;
  }

  @Patch(':id/custom-data')
  @UseGuards(EnsureUserAndOrgGuard)
  async updateCustomData(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() rawCustomData: unknown,
  ): Promise<InventoryItem> {
    if (!id) {
      throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
    }

    this.logger.log(
      `Updating custom data for inventory item ${id} for user ${req.user.id}`,
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
