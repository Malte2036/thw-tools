import { CreateVehicleDto, CreateVehicleDtoSchema } from '@/api/vehicle/vehicleModels';
import { Dialog } from '../base';
import { Button } from '../base';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';

type Props = {
  isOpen: boolean;
  isSubmitting: boolean;
  errorMessage: string;
  onClose: () => void;
  onSubmit: (data: CreateVehicleDto) => void;
  onError: (message: string) => void;
};

export default function AddVehicleDialog({
  isOpen,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
  onError,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isValid },
  } = useForm<CreateVehicleDto>({
    resolver: zodResolver(CreateVehicleDtoSchema),
    defaultValues: {
      canBeReserved: true,
    },
  });

  // Common THW vehicle types
  const vehicleTypes = ['MTW', 'MzKw', 'GKW', 'MLW', 'Kipper', 'Anhänger', 'Sonstige'];

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleFormSubmit = () => {
    const result = CreateVehicleDtoSchema.safeParse(getValues());
    if (!result.success) {
      onError(result.error.message);
      return;
    }

    console.log('data', result.data);
    onSubmit(result.data);
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog title="Neues Fahrzeug hinzufügen">
      <div slot="content">
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name*
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thw-500"
              {...register('name')}
              placeholder="z.B. MTW OV Stab"
              required
            />
            {errors.name && <span className="text-red-600 text-sm">{errors.name.message}</span>}
          </div>

          <div>
            <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-1">
              Kennzeichen*
            </label>
            <input
              id="licensePlate"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thw-500"
              {...register('licensePlate')}
              placeholder="z.B. THW-12345"
              required
            />
            {errors.licensePlate && (
              <span className="text-red-600 text-sm">{errors.licensePlate.message}</span>
            )}
          </div>

          <div>
            <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
              Fahrzeugtyp*
            </label>
            <select
              id="vehicleType"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thw-500"
              {...register('vehicleType')}
              required
            >
              <option value="" disabled>
                Bitte auswählen
              </option>
              {vehicleTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.vehicleType && (
              <span className="text-red-600 text-sm">{errors.vehicleType.message}</span>
            )}
          </div>

          <div>
            <label htmlFor="radioCallName" className="block text-sm font-medium text-gray-700 mb-1">
              Funkrufname
            </label>
            <input
              id="radioCallName"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thw-500"
              {...register('radioCallName')}
              placeholder="z.B. Heros 86/25"
              required
            />
            {errors.radioCallName && (
              <span className="text-red-600 text-sm">{errors.radioCallName.message}</span>
            )}
          </div>

          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
              Einheit/Bereich
            </label>
            <input
              id="unit"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thw-500"
              {...register('unit')}
              placeholder="z.B. OV Stab"
              required
            />
            {errors.unit && <span className="text-red-600 text-sm">{errors.unit.message}</span>}
          </div>

          <div>
            <label htmlFor="canBeReserved" className="flex items-center">
              <input
                id="canBeReserved"
                type="checkbox"
                className="mr-2 h-4 w-4 text-thw-500 focus:ring-thw-500 border-gray-300 rounded"
                {...register('canBeReserved')}
              />
              <span className="text-sm font-medium text-gray-700">Kann reserviert werden</span>
            </label>
            {errors.canBeReserved && (
              <span className="text-red-600 text-sm">{errors.canBeReserved.message}</span>
            )}
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md">
              {errorMessage}
            </div>
          )}
        </form>
      </div>
      <div slot="footer">
        <div className="flex justify-end gap-3 pt-2">
          <Button type="secondary" disabled={isSubmitting} onClick={handleClose}>
            Abbrechen
          </Button>

          <Button
            type="primary"
            disabled={isSubmitting || !isValid}
            onClick={() => handleFormSubmit()}
          >
            {isSubmitting && <span className="inline-block animate-spin mr-2">⟳</span>}
            Fahrzeug erstellen
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
