import { useVehicleStore } from '@/provider/store/vehicleStore';
import { apiGet, apiPost, apiPut, ApiRequestOptions } from '../apiGeneric';
import {
  CreateVehicleDto,
  Vehicle,
  VehicleRental,
  VehicleRentalId,
  VehicleRentalSchema,
  VehicleSchema,
} from './vehicleModels';
import { CreateVehicleRentalDto } from './vehicleModels';

/**
 * Lädt alle Fahrzeuge für die Organisation des Benutzers
 */
export async function fetchAndSetVehicles(requestOptions: ApiRequestOptions): Promise<void> {
  const fetchPromise = apiGet<Vehicle[]>('/vehicles', requestOptions, (data) => {
    const result = VehicleSchema.array().safeParse(data);
    if (!result.success) {
      console.error('Error parsing Vehicle[]:', result.error);
    }
    return result.success;
  });

  useVehicleStore.getState().setFetching(true);

  try {
    const result = await fetchPromise;

    useVehicleStore.getState().setVehicles(result.data);

    // TODO: Add last fetched
    // updateLastFetched('vehicles');

    return;
  } catch (error) {
    useVehicleStore.getState().setFetching(false);
    throw error;
  }
}

/**
 * Erstellt ein neues Fahrzeug
 */
export async function createVehicle(
  requestOptions: ApiRequestOptions,
  vehicleData: CreateVehicleDto
): Promise<Vehicle> {
  const result = await apiPost<Vehicle>('/vehicles', requestOptions, vehicleData, (data: any) => {
    const result = VehicleSchema.safeParse(data);
    if (!result.success) {
      console.error('Error parsing Vehicle:', result.error);
    }
    return result.success;
  });

  // Fahrzeuge neu laden, um den aktuellen Status zu erhalten
  fetchAndSetVehicles(requestOptions).catch(console.error);

  return result.data;
}

/**
 * Lädt alle Ausleihen für die Organisation des Benutzers
 */
export async function fetchRentals(requestOptions: ApiRequestOptions): Promise<VehicleRental[]> {
  const result = await apiGet<VehicleRental[]>('/vehicles/rentals', requestOptions, (data) => {
    const result = VehicleRentalSchema.array().safeParse(data);
    if (!result.success) {
      console.error('Error parsing VehicleRental[]:', result.error);
    }
    return result.success;
  });

  // TODO: Add last fetched
  // updateLastFetched('rentals');
  return result.data;
}

/**
 * Erstellt eine neue Fahrzeugausleihe
 */
export async function createRental(
  requestOptions: ApiRequestOptions,
  rentalData: CreateVehicleRentalDto
): Promise<VehicleRental> {
  const result = await apiPost<VehicleRental>(
    '/vehicles/rentals',
    requestOptions,
    rentalData,
    (data: any) => {
      const result = VehicleRentalSchema.safeParse(data);
      if (!result.success) {
        console.error('Error parsing VehicleRental:', result.error);
      }
      return result.success;
    }
  );

  // Fahrzeuge neu laden, um den aktuellen Status zu erhalten
  fetchAndSetVehicles(requestOptions).catch(console.error);

  return result.data;
}

/**
 * Storniert eine bestehende Fahrzeugausleihe
 */
export async function cancelRental(
  requestOptions: ApiRequestOptions,
  rentalId: VehicleRentalId,
  reason?: string
): Promise<VehicleRental> {
  const result = await apiPut<VehicleRental>(
    `/vehicles/rentals/${rentalId}/cancel`,
    requestOptions,
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
  fetchAndSetVehicles(requestOptions).catch(console.error);

  return result.data;
}
