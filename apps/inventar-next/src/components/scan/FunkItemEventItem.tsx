import {
  eventTypeToEmoji,
  eventTypeToFriendlyString,
  FunkItem,
  FunkItemDeviceId,
  FunkItemEvent,
  userToFriendlyString,
} from '@/api/funk/funkModels';
import { useEffect, useState } from 'react';
import { useOrganisationStore } from '@/provider/store/organisationStore';
import { dateToFriendlyString } from '@thw-tools/shared';
import { cn } from '@/lib/utils';

type Props = {
  event: FunkItemEvent;
  deviceId: FunkItemDeviceId;
  isSelected: boolean;
  item: FunkItem;
  secondary?: boolean;
};

export default function FunkItemEventItem({
  event,
  deviceId,
  isSelected,
  item,
  secondary = false,
}: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [itemType, setItemType] = useState<string | undefined>(undefined);

  const getOrganisationMemberByInternalId = useOrganisationStore(
    (state) => state.getOrganisationMemberByInternalId
  );
  const eventUser = getOrganisationMemberByInternalId(event.userId)?.user;

  useEffect(() => {
    if (!item.deviceId) return;

    // TODO: Implement if inventoryStore is implemented
    // getInventoryItemByInventarNummer(item.deviceId).then((inventoryItem) => {
    //   setItemType(inventoryItem?.typ ?? undefined);
    // });
  }, [item.deviceId]);

  return (
    <a
      className={cn(
        'text-xl flex flex-row items-center p-2 gap-2 bg-thw-50 border-thw-500 border-2 shadow-sm rounded-2xl transition-colors hover:cursor-pointer overflow-x-auto',
        secondary && 'border-dashed border-thw-300',
        isSelected && 'bg-thw-300'
      )}
      href={`/funk/device/${deviceId}`}
    >
      <div className="text-2xl">{eventTypeToEmoji(event.type)}</div>
      <div className="flex flex-col gap-0 w-full">
        <div className="flex flex-row gap-2 justify-between w-full">
          <div className="text-nowrap font-bold">{deviceId}</div>
          <div className="flex gap-1">
            <div
              className={cn(
                'rounded-xl text-sm px-2 h-min bg-green-200 whitespace-nowrap',
                event.type === 'borrowed' && 'bg-red-200'
              )}
            >
              {itemType ?? eventTypeToFriendlyString(event.type)}
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-2 items-center w-full">
          <div className="text-sm text-nowrap text-gray-500">
            <span className="italic">
              {eventUser ? <>{userToFriendlyString(eventUser)}</> : 'Unbekannt'}
            </span>
            {' am '}
            <span>{dateToFriendlyString(new Date(event.date))}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
