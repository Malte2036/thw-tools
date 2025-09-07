'use client';

import { Dialog } from '@/components/base';

interface Props {
  onClose: () => void;
}

export default function PermissionDeniedDialog({ onClose }: Props) {
  return (
    <Dialog title="Kamera-Berechtigung verweigert" onClose={onClose} onOutsideClick={onClose}>
      <div className="space-y-4">
        <p>
          Der Zugriff auf die Kamera wurde verweigert. Bitte erlauben Sie den Zugriff auf die Kamera
          in Ihren Browser-Einstellungen und versuchen Sie es erneut.
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Verstanden
          </button>
        </div>
      </div>
    </Dialog>
  );
}
