import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateVehicleRentalDto {
  @IsUUID()
  @IsNotEmpty()
  vehicleId: string;

  @IsString()
  @IsNotEmpty()
  purpose: string;

  @IsDateString()
  @IsNotEmpty()
  plannedStart: string;

  @IsDateString()
  @IsNotEmpty()
  plannedEnd: string;
}
