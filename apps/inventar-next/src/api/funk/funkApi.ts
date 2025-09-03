import { apiGet, apiGetFile, apiPost, ApiRequestOptions } from '../apiGeneric';
import {
  FunkItemEventBulkSchema,
  FunkItemEventSchema,
  FunkItemSchema,
  type FunkItem,
  type FunkItemDeviceId,
  type FunkItemEvent,
  type FunkItemEventBulk,
  type FunkItemEventType,
} from './funkModels';

export async function getFunkItems(requestOptions: ApiRequestOptions): Promise<FunkItem[]> {
  const response = await apiGet<FunkItem[]>('/funk', requestOptions, (data) =>
    data.every((d) => {
      const result = FunkItemSchema.safeParse(d);
      if (!result.success) {
        console.error('Error parsing FunkItem:', result.error);
      }
      return result.success;
    })
  );
  return response.data;
}

export async function bulkCreateFunkItemEvents(
  requestOptions: ApiRequestOptions,
  deviceIds: FunkItemDeviceId[],
  batteryCount: number,
  eventType: FunkItemEventType
): Promise<void> {
  await apiPost<FunkItemEvent[]>(`/funk/events/bulk`, requestOptions, {
    deviceIds,
    batteryCount,
    eventType,
  });
}

export async function getFunkItemEvents(
  requestOptions: ApiRequestOptions,
  deviceId: FunkItemDeviceId
): Promise<FunkItemEvent[]> {
  const response = await apiGet<FunkItemEvent[]>(
    `/funk/${deviceId}/events`,
    requestOptions,
    (data) =>
      data.every((d) => {
        const result = FunkItemEventSchema.safeParse(d);
        if (!result.success) {
          console.error('Error parsing FunkItemEvent:', result.error, d);
        }
        return result.success;
      })
  );
  return response.data;
}

export async function getFunkItemEventBulks(
  requestOptions: ApiRequestOptions
): Promise<FunkItemEventBulk[]> {
  const response = await apiGet<FunkItemEventBulk[]>(`/funk/events/bulk`, requestOptions, (data) =>
    data.every((d) => {
      const result = FunkItemEventBulkSchema.safeParse(d);

      if (!result.success) {
        console.error('Error parsing FunkItemEventBulk:', result.error, d);
      }
      return result.success;
    })
  );
  return response.data;
}

export async function exportFunkItemEventBulksAsCsv(
  requestOptions: ApiRequestOptions
): Promise<Blob> {
  return await apiGetFile(`/funk/events/bulk/export`, requestOptions);
}
