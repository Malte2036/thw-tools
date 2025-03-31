import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  licensePlate: string;

  @IsNotEmpty()
  @IsString()
  vehicleType: string;

  @IsNotEmpty()
  @IsString()
  radioCallName: string;

  @IsNotEmpty()
  @IsString()
  unit: string;
}
