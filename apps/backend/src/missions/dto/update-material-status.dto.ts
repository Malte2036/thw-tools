import { IsEnum } from 'class-validator';
import { MaterialStatus } from '@prisma/client/inventory';

export class UpdateMaterialStatusDto {
  @IsEnum(MaterialStatus)
  status: MaterialStatus;
}
