import { BRAND, z } from 'zod';
import { OrganisationIdSchema, UserIdSchema } from './organisationModels';
export type VehicleId = string & BRAND<'VehicleId'>;
export const VehicleIdSchema = z.string().brand<'VehicleId'>();

// Vehicle types
export const VehicleSchema = z.object({
	id: VehicleIdSchema,
	name: z.string(),
	radioCallName: z.string(),
	licensePlate: z.string(),
	vehicleType: z.string(),
	unit: z.string(),
	organisationId: OrganisationIdSchema,
	createdAt: z.string().datetime().optional(),
	updatedAt: z.string().datetime().optional()
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
	updatedAt: z.string().datetime().optional()
});

export type VehicleRental = z.infer<typeof VehicleRentalSchema>;

// Schema for creating a new vehicle rental
export const CreateVehicleRentalDtoSchema = z.object({
	vehicleId: VehicleIdSchema,
	purpose: z.string(),
	plannedStart: z.string().datetime(),
	plannedEnd: z.string().datetime()
});

export type CreateVehicleRentalDto = z.infer<typeof CreateVehicleRentalDtoSchema>;

// Schema for creating a new vehicle
export const CreateVehicleDtoSchema = z.object({
	name: z.string(),
	radioCallName: z.string(),
	licensePlate: z.string(),
	vehicleType: z.string(),
	unit: z.string()
});

export type CreateVehicleDto = z.infer<typeof CreateVehicleDtoSchema>;

export const vehicleToFriendlyString = (vehicle: Vehicle | undefined) => {
	if (!vehicle) return '';

	return vehicle.name;
};
