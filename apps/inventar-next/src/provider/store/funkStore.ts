import { ApiRequestOptions } from '@/api/apiGeneric';
import { bulkCreateFunkItemEvents, getFunkItemEventBulks, getFunkItems } from '@/api/funk/funkApi';
import {
  FunkItem,
  FunkItemDeviceId,
  FunkItemEvent,
  FunkItemEventBulk,
  FunkItemEventId,
  FunkItemId,
  FunkItemEventType,
} from '@/api/funk/funkModels';
import { create } from 'zustand';

interface FunkStore {
  funkItems: FunkItem[] | null;
  funkItemEventBulks: FunkItemEventBulk[] | null;
  fetch: (requestOptions: ApiRequestOptions) => Promise<void>;
  bulkCreateFunkItemEvents: (
    requestOptions: ApiRequestOptions,
    deviceIds: FunkItemDeviceId[],
    batteryCount: number,
    eventType: FunkItemEventType
  ) => Promise<void>;
  getFunkItemByInternalId: (internalId: FunkItemId) => FunkItem | undefined;
  getFunkItemByDeviceId: (deviceId: FunkItemDeviceId) => FunkItem | undefined;
  getFunkItemEventByInternalId: (internalId: FunkItemEventId) => FunkItemEvent | undefined;
  getLastFunkItemEventByFunkItemInternalId: (internalId: FunkItemId) => FunkItemEvent | undefined;
  getAllFunkItemEventsByFunkItemDeviceId: (deviceId: FunkItemDeviceId) => FunkItemEvent[];
  getBorrowedDevicesCount: () => number;
  getBorrowedBatteryCount: () => number;
}

export const useFunkStore = create<FunkStore>((set, get) => ({
  funkItems: null,
  funkItemEventBulks: null,
  fetch: async (requestOptions: ApiRequestOptions) => {
    const [funkItems, funkItemEventBulks] = await Promise.all([
      getFunkItems(requestOptions),
      getFunkItemEventBulks(requestOptions),
    ]);

    set({ funkItems, funkItemEventBulks });
  },
  bulkCreateFunkItemEvents: async (
    requestOptions: ApiRequestOptions,
    deviceIds: FunkItemDeviceId[],
    batteryCount: number,
    eventType: FunkItemEventType
  ) => {
    await bulkCreateFunkItemEvents(requestOptions, deviceIds, batteryCount, eventType);
    await get().fetch(requestOptions);
  },
  getFunkItemByInternalId: (internalId: FunkItemId) => {
    return get().funkItems?.find((item) => item.id === internalId);
  },
  getFunkItemEventByInternalId: (internalId: FunkItemEventId) => {
    return get()
      .funkItemEventBulks?.flatMap((bulk) => bulk.events)
      .find((event) => event.eventId === internalId)?.event;
  },
  getLastFunkItemEventByFunkItemInternalId: (internalId: FunkItemId) => {
    return get()
      .funkItemEventBulks?.flatMap((bulk) => bulk.events)
      .find((event) => event.event.funkItemId === internalId)?.event;
  },
  getFunkItemByDeviceId: (deviceId: FunkItemDeviceId) => {
    return get().funkItems?.find((item) => item.deviceId === deviceId);
  },
  getAllFunkItemEventsByFunkItemDeviceId: (deviceId: FunkItemDeviceId) => {
    const events = get().funkItemEventBulks?.flatMap((bulk) => bulk.events);
    if (!events) return [];

    return events
      .map((event) => ({
        event,
        deviceId:
          event.event.funkItemId && get().getFunkItemByInternalId(event.event.funkItemId)?.deviceId,
      }))
      .filter((event) => event.deviceId === deviceId)
      .map((event) => event.event.event);
  },
  getBorrowedDevicesCount: () => {
    return (
      get().funkItems?.filter(
        (item) => get().getLastFunkItemEventByFunkItemInternalId(item.id)?.type === 'borrowed'
      ).length ?? 0
    );
  },
  getBorrowedBatteryCount: () => {
    return get().funkItemEventBulks?.reduce((acc, bulk) => acc + bulk.batteryCount, 0) ?? 0;
  },
}));
