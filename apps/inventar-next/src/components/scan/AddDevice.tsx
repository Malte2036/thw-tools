import {
  FunkItemDeviceId,
  FunkItemDeviceIdSchema,
  FunkItemEvent,
  FunkItemEventType,
} from '@/api/funk/funkModels';
import QRScanner from './QRScanner';
import { toast } from 'sonner';
import { useCallback, useState } from 'react';
import { useFunkStore } from '@/provider/store/funkStore';
import { Button } from '../base';
import Input from '../base/Input';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { ApiRequestOptions } from '@/api/apiGeneric';
import { batteryCountToFriendlyString, eventTypeToFriendlyString } from '@/api/funk/funkModels';
import ManuelDeviceIdInput from './ManuelDeviceIdInput';

interface Props {
  reset: () => void;
}

export default function AddDevice({ reset }: Props) {
  const { getAccessToken, getIdToken } = useKindeAuth();

  const [scannedDeviceIds, setScannedDeviceIds] = useState<
    {
      deviceId: FunkItemDeviceId;
      lastEvent?: FunkItemEvent;
    }[]
  >([]);
  const [batteryCountInput, setBatteryCountInput] = useState<string>('0');

  const {
    getFunkItemByDeviceId,
    getLastFunkItemEventByFunkItemInternalId,
    bulkCreateFunkItemEvents,
  } = useFunkStore();

  const onScan = useCallback(
    (decodedText: string, isQrScan: boolean = false) => {
      if (!decodedText) {
        return;
      }

      const parsed = FunkItemDeviceIdSchema.safeParse(decodedText.trim());

      if (!parsed.success) {
        toast.error(`Ungültige Geräte-ID: ${decodedText}`);
        return;
      }

      // Use functional update to access current state
      setScannedDeviceIds((currentScannedDeviceIds) => {
        if (currentScannedDeviceIds.some((item) => item.deviceId === decodedText)) {
          return currentScannedDeviceIds; // Return unchanged state if device already exists
        }

        const existingItem = getFunkItemByDeviceId(parsed.data);
        const lastEvent = existingItem && getLastFunkItemEventByFunkItemInternalId(existingItem.id);

        const newState = [
          ...currentScannedDeviceIds,
          {
            deviceId: parsed.data,
            lastEvent,
          },
        ];

        if (isQrScan) {
          // playScanSound();
        }

        toast.success(`Gerät mit der ID ${parsed.data} gescannt.`);

        return newState;
      });
    },
    [getFunkItemByDeviceId, getLastFunkItemEventByFunkItemInternalId]
  );

  const submit = async (eventType: FunkItemEventType) => {
    if (scannedDeviceIds.length == 0) {
      return;
    }

    const batteryCount = parseInt(batteryCountInput);

    const accessToken = await getAccessToken();
    const idToken = await getIdToken();
    if (!accessToken || !idToken) {
      return;
    }

    const requestOptions: ApiRequestOptions = {
      token: accessToken,
      idToken,
    };

    await bulkCreateFunkItemEvents(
      requestOptions,
      scannedDeviceIds.map((e) => e.deviceId),
      batteryCount,
      eventType
    );

    toast.success(
      `${scannedDeviceIds.length} Gerät${scannedDeviceIds.length > 1 ? 'e' : ''} und ${batteryCountToFriendlyString(batteryCount)} wurden erfolgreich ${eventTypeToFriendlyString(eventType)}.`
    );

    setScannedDeviceIds([]);
    reset();
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        <QRScanner onScan={onScan} />
        <ManuelDeviceIdInput onScan={onScan} />
      </div>
      {scannedDeviceIds.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="font-bold text-2xl">Gescannte Geräte:</div>
          <div>
            {scannedDeviceIds.map((scannedDeviceId) => (
              <div key={scannedDeviceId.deviceId} className="flex gap-2 items-center">
                <div>{scannedDeviceId.deviceId}</div>
                {scannedDeviceId.lastEvent && (
                  // <InventarItemEventTypeBadge type={scannedDeviceId.lastEvent.type} />
                  <div>{scannedDeviceId.lastEvent.type}</div>
                )}
              </div>
            ))}
          </div>

          <Input
            label="Batterien"
            type="number"
            placeholder="Anzahl Batterien"
            value={batteryCountInput}
            onChange={setBatteryCountInput}
            inputMode="numeric"
          />

          <div className="flex gap-2 w-full justify-between">
            <Button
              type={
                scannedDeviceIds.every(
                  (scannedDeviceId) => scannedDeviceId.lastEvent?.type === 'returned'
                )
                  ? 'secondary'
                  : 'primary'
              }
              onClick={() => submit('returned')}
            >
              Zurückgeben
            </Button>
            <Button
              type={
                scannedDeviceIds.every(
                  (scannedDeviceId) => scannedDeviceId.lastEvent?.type === 'borrowed'
                )
                  ? 'secondary'
                  : 'primary'
              }
              onClick={() => submit('borrowed')}
            >
              Ausleihen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
