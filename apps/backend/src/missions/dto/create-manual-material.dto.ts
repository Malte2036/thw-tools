import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateManualMaterialDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsString()
  @IsOptional()
  unit?: string;
}
