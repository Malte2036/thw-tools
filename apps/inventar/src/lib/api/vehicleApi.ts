import { updateLastFetched } from '$lib/shared/stores/apiMetaStore';
import { vehicles } from '$lib/shared/stores/vehicleStore';
import { apiGet, apiPost, apiPut } from './apiGeneric';
import {
	VehicleSchema,
	VehicleRentalSchema,
	CreateVehicleRentalDtoSchema,
	type Vehicle,
	type VehicleRental,
	type CreateVehicleRentalDto
} from './vehicleModels';

/**
 * Lädt alle Fahrzeuge für die Organisation des Benutzers
 */
export async function fetchVehicles(): Promise<void> {
	const fetchPromise = apiGet<Vehicle[]>('/vehicles', (data) => {
		const result = VehicleSchema.array().safeParse(data);
		if (!result.success) {
			console.error('Error parsing Vehicle[]:', result.error);
		}
		return result.success;
	});

	vehicles.update((state) => ({
		...state,
		fetching: fetchPromise
	}));

	try {
		const result = await fetchPromise;

		vehicles.update((state) => ({
			...state,
			fetching: undefined,
			items: result.data
		}));

		updateLastFetched('vehicles');

		return;
	} catch (error) {
		vehicles.update((state) => ({
			...state,
			fetching: undefined
		}));
		throw error;
	}
}

/**
 * Lädt alle Ausleihen für die Organisation des Benutzers
 */
export async function fetchRentals(): Promise<VehicleRental[]> {
	const result = await apiGet<VehicleRental[]>('/vehicles/rentals', (data) => {
		const result = VehicleRentalSchema.array().safeParse(data);
		if (!result.success) {
			console.error('Error parsing VehicleRental[]:', result.error);
		}
		return result.success;
	});

	updateLastFetched('rentals');
	return result.data;
}

/**
 * Erstellt eine neue Fahrzeugausleihe
 */
export async function createRental(rentalData: CreateVehicleRentalDto): Promise<VehicleRental> {
	const result = await apiPost<VehicleRental>('/vehicles/rentals', rentalData, (data: any) => {
		const result = VehicleRentalSchema.safeParse(data);
		if (!result.success) {
			console.error('Error parsing VehicleRental:', result.error);
		}
		return result.success;
	});

	// Fahrzeuge neu laden, um den aktuellen Status zu erhalten
	fetchVehicles().catch(console.error);

	return result.data;
}

/**
 * Storniert eine bestehende Fahrzeugausleihe
 */
export async function cancelRental(rentalId: string, reason?: string): Promise<VehicleRental> {
	const result = await apiPut<VehicleRental>(
		`/vehicles/rentals/${rentalId}/cancel`,
		{ reason: reason || '' },
		(data: any) => {
			const result = VehicleRentalSchema.safeParse(data);
			if (!result.success) {
				console.error('Error parsing VehicleRental:', result.error);
			}
			return result.success;
		}
	);

	// Fahrzeuge neu laden, um den aktuellen Status zu erhalten
	fetchVehicles().catch(console.error);

	return result.data;
}
