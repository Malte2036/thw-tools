export interface Vehicle {
	id: string;
	licensePlate: string;
	vehicleType: string;
	radioCallName: string;
	unit: string;
	status: 'available' | 'rented' | 'maintenance' | 'out_of_service';
	mileage: number;
	lastInspection?: Date;
	nextInspection?: Date;
	customData?: {
		lastUpdated?: string;
		notes?: string;
	};
}

export interface User {
	id: string;
	name: string;
	email: string;
	unit: string;
}

export interface CarRental {
	id: string;
	vehicleId: string;
	userId: string;
	userName: string;
	userUnit: string;
	type: 'active' | 'planned' | 'completed';
	purpose: string;
	startMileage?: number;
	endMileage?: number;
	plannedStart: Date;
	plannedEnd: Date;
	startTime?: Date;
	endTime?: Date;
	status: 'active' | 'planned' | 'completed' | 'canceled';
	customData?: {
		notes?: string;
		canceledBy?: string;
		canceledAt?: Date;
		cancellationReason?: string;
	};
}

export type VehicleWithRentals = Vehicle & {
	currentRental?: CarRental;
	plannedRentals?: CarRental[];
};
