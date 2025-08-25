import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MissionsService } from './missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { ScanMaterialDto } from './dto/scan-material.dto';
import { CreateManualMaterialDto } from './dto/create-manual-material.dto';
import { UpdateMaterialStatusDto } from './dto/update-material-status.dto';

@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  // This method assumes the UserOrgMiddleware attaches the user's organisation
  // details to the request object.
  private getOrgIdFromRequest(req): string {
    if (req.user && req.user.organisations && req.user.organisations[0]) {
      return req.user.organisations[0].organisationId;
    }
    // Fallback for safety, but middleware should prevent this.
    throw new Error('Could not determine organisation from request.');
  }

  @Post()
  create(@Req() req, @Body() createMissionDto: CreateMissionDto) {
    const organisationId = this.getOrgIdFromRequest(req);
    return this.missionsService.create(organisationId, createMissionDto);
  }

  @Get()
  findAll(@Req() req) {
    const organisationId = this.getOrgIdFromRequest(req);
    return this.missionsService.findAllForOrg(organisationId);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id', ParseUUIDPipe) id: string) {
    const organisationId = this.getOrgIdFromRequest(req);
    return this.missionsService.findOne(id, organisationId);
  }

  @Post(':id/scan')
  scanMaterial(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() scanMaterialDto: ScanMaterialDto,
  ) {
    return this.missionsService.scanMaterial(id, scanMaterialDto);
  }

  @Post(':id/manual-materials')
  createManualMaterial(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createManualDto: CreateManualMaterialDto,
  ) {
    return this.missionsService.createManualMaterial(id, createManualDto);
  }

  @Patch(':missionId/materials/:materialId')
  updateMaterialStatus(
    @Param('materialId', ParseUUIDPipe) materialId: string,
    @Body() updateDto: UpdateMaterialStatusDto,
  ) {
    return this.missionsService.updateMaterialStatus(materialId, updateDto);
  }

  @Patch(':id/complete')
  complete(@Param('id', ParseUUIDPipe) id: string) {
    return this.missionsService.complete(id);
  }
}
