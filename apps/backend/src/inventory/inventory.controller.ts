import {
  Controller,
  Logger,
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

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly userService: UserService,
    private readonly organisationService: OrganisationService,
    private readonly inventoryService: InventoryService,
  ) {}

  @Post('import/csv')
  @UseInterceptors(FileInterceptor('file'))
  async importInventoryViaCsv(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const [, organisation] = await getUserAndOrgFromRequestAndThrow(
      req,
      this.userService,
      this.organisationService,
    );

    Logger.log(`Received file: ${file.originalname}`);
    this.inventoryService.parseCsvData(organisation, file);
    Logger.log('File processed');
  }
}
