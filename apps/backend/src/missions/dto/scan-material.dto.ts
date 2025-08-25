import { IsUUID } from 'class-validator';

export class ScanMaterialDto {
  @IsUUID()
  inventoryItemId: string;
}
