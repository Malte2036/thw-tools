import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateMissionDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  startDate?: Date;
}
