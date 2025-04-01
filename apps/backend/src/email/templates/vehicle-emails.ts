import { Vehicle } from '@prisma/client';
import { VehicleRental } from '@prisma/client';
import { User } from '@prisma/client';

interface VehicleEmailData {
  vehicle: Pick<Vehicle, 'id' | 'name' | 'radioCallName' | 'licensePlate'>;
  user: Pick<User, 'firstName' | 'lastName' | 'email'>;
  rental: Pick<VehicleRental, 'purpose' | 'plannedStart' | 'plannedEnd'>;
  orgName: string;
}

export const getRentalConfirmationEmail = (data: VehicleEmailData) => ({
  to: data.user.email,
  subject: `Fahrzeugreservierung bestätigt: ${data.vehicle.name}`,
  html: `
    <h2>Deine Fahrzeugreservierung wurde bestätigt</h2>
    <p>Hallo ${data.user.firstName} ${data.user.lastName},</p>
    <p>Deine Fahrzeugreservierung wurde erfolgreich erstellt:</p>
    <ul>
      <li><strong>Fahrzeug:</strong> ${data.vehicle.name} (${data.vehicle.licensePlate})</li>
      <li><strong>Zweck:</strong> ${data.rental.purpose}</li>
      <li><strong>Von:</strong> ${new Date(data.rental.plannedStart).toLocaleString('de-DE')}</li>
      <li><strong>Bis:</strong> ${new Date(data.rental.plannedEnd).toLocaleString('de-DE')}</li>
    </ul>
    <p><a href="https://funk.thw-duesseldorf.de/fahrzeuge?vehicleId=${data.vehicle.id}">Zur Fahrzeugreservierung</a></p>
    <p>Viele Grüße<br>${data.orgName}</p>
  `,
});

export const getRentalCancellationEmail = (data: VehicleEmailData) => ({
  to: data.user.email,
  subject: `Fahrzeugreservierung storniert: ${data.vehicle.name}`,
  html: `
    <h2>Deine Fahrzeugreservierung wurde storniert</h2>
    <p>Hallo ${data.user.firstName} ${data.user.lastName},</p>
    <p>Deine Fahrzeugreservierung wurde storniert:</p>
    <ul>
      <li><strong>Fahrzeug:</strong> ${data.vehicle.name} (${data.vehicle.licensePlate})</li>
      <li><strong>Zweck:</strong> ${data.rental.purpose}</li>
      <li><strong>Von:</strong> ${new Date(data.rental.plannedStart).toLocaleString('de-DE')}</li>
      <li><strong>Bis:</strong> ${new Date(data.rental.plannedEnd).toLocaleString('de-DE')}</li>
    </ul>
    <p><a href="https://funk.thw-duesseldorf.de/fahrzeuge?vehicleId=${data.vehicle.id}">Zur Fahrzeugübersicht</a></p>
    <p>Viele Grüße<br>${data.orgName}</p>
  `,
});
