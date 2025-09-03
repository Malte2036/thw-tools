import { BRAND, z } from 'zod';
import { OrganisationIdSchema } from '../organisation/organisationModels';
import { UserIdSchema } from '../user/userModels';
export type VehicleId = string & BRAND<'VehicleId'>;
export const VehicleIdSchema = z.string().brand<'VehicleId'>();

// Vehicle types
export const VehicleSchema = z.object({
  id: VehicleIdSchema,
  name: z.string(),
  radioCallName: z.string().nullish(),
  licensePlate: z.string(),
  vehicleType: z.string(),
  unit: z.string().nullish(),
  organisationId: OrganisationIdSchema,
  bodyManufacturer: z.string().nullish(),
  bodyType: z.string().nullish(),
  chassis: z.string().nullish(),
  load: z.string().nullish(),
  payload: z.string().nullish(),
  seats: z.number().nullish(),
  specialFeatures: z.string().nullish(),
  totalWeight: z.string().nullish(),
  yearBuilt: z.number().nullish(),
  canBeReserved: z.boolean().default(true),
  createdAt: z.string().datetime().nullish(),
  updatedAt: z.string().datetime().nullish(),
});

export type Vehicle = z.infer<typeof VehicleSchema>;

// Vehicle rental status enum
export const VehicleRentalStatusEnum = z.enum(['active', 'canceled']);

export type VehicleRentalStatus = z.infer<typeof VehicleRentalStatusEnum>;

export type VehicleRentalId = string & BRAND<'VehicleRentalId'>;
export const VehicleRentalIdSchema = z.string().brand<'VehicleRentalId'>();

// Vehicle rental model matching the schema.prisma definition
export const VehicleRentalSchema = z.object({
  id: VehicleRentalIdSchema,
  vehicleId: VehicleIdSchema,
  userId: UserIdSchema,
  purpose: z.string(),
  plannedStart: z.union([z.string().datetime(), z.date()]),
  plannedEnd: z.union([z.string().datetime(), z.date()]),
  status: VehicleRentalStatusEnum,
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type VehicleRental = z.infer<typeof VehicleRentalSchema>;

// Schema for creating a new vehicle rental
export const CreateVehicleRentalDtoSchema = z.object({
  vehicleId: VehicleIdSchema,
  purpose: z.string(),
  plannedStart: z.string().datetime(),
  plannedEnd: z.string().datetime(),
});

export type CreateVehicleRentalDto = z.infer<typeof CreateVehicleRentalDtoSchema>;

// Schema for creating a new vehicle
export const CreateVehicleDtoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  radioCallName: z.string().nullish(),
  licensePlate: z.string().min(1, 'Kennzeichen is required'),
  vehicleType: z.string().min(1, 'Fahrzeugtyp is required'),
  unit: z.string().nullish(),
  bodyManufacturer: z.string().nullish(),
  bodyType: z.string().nullish(),
  chassis: z.string().nullish(),
  load: z.string().nullish(),
  payload: z.string().nullish(),
  seats: z.number().nullish(),
  specialFeatures: z.string().nullish(),
  totalWeight: z.string().nullish(),
  yearBuilt: z.number().nullish(),
  canBeReserved: z.boolean().default(true),
});

export type CreateVehicleDto = z.infer<typeof CreateVehicleDtoSchema>;

export const vehicleToFriendlyString = (vehicle: Vehicle | undefined) => {
  if (!vehicle) return '';

  return vehicle.name;
};
