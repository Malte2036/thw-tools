import { z } from 'zod';

// Basis-Schema für das Fahrzeug
export const VehicleSchema = z.object({
	id: z.string().uuid(),
	licensePlate: z.string(),
	vehicleType: z.string(),
	radioCallName: z.string(),
	unit: z.string(),
	organisationId: z.string().uuid(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	rentals: z.array(z.any()).optional()
});

// Basis-Schema für die Fahrzeugausleihe
export const VehicleRentalSchema = z.object({
	id: z.string().uuid(),
	vehicleId: z.string().uuid(),
	userId: z.string().uuid(),
	purpose: z.string(),
	plannedStart: z.string().datetime(),
	plannedEnd: z.string().datetime(),
	status: z.enum(['active', 'planned', 'canceled']),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	vehicle: z.any().optional(),
	user: z.any().optional()
});

// Input DTO für die Erstellung einer Ausleihe
export const CreateVehicleRentalDtoSchema = z.object({
	vehicleId: z.string().uuid(),
	userId: z.string().uuid(),
	purpose: z.string(),
	plannedStart: z.string().datetime(),
	plannedEnd: z.string().datetime()
});

// Typen aus den Schemas ableiten
export type Vehicle = z.infer<typeof VehicleSchema>;
export type VehicleRental = z.infer<typeof VehicleRentalSchema>;
export type CreateVehicleRentalDto = z.infer<typeof CreateVehicleRentalDtoSchema>;

// Hilfsfunktion, um den Status eines Fahrzeugs basierend auf seinen Ausleihen zu berechnen
export function calculateVehicleStatus(
	rentals: VehicleRental[] | undefined
): 'available' | 'rented' | 'maintenance' | 'out_of_service' {
	if (!rentals || rentals.length === 0) {
		return 'available';
	}

	// Aktive Ausleihe vorhanden?
	const hasActiveRental = rentals.some((rental) => rental.status === 'active');
	if (hasActiveRental) {
		return 'rented';
	}

	return 'available';
}
