import {
  batteryCountToFriendlyString,
  eventTypeToEmoji,
  FunkItemEventBulk,
} from '@/api/funk/funkModels';
import { userToFriendlyString } from '@/api/user/userModels';
import { useFunkStore } from '@/provider/store/funkStore';
import { useOrganisationStore } from '@/provider/store/organisationStore';
import { dateToFriendlyString } from '@thw-tools/shared';
import InventarItemEventTypeBadge from './InventarItemEventTypeBadge';

export default function InventarItemEventBulkItem({ bulk }: { bulk: FunkItemEventBulk }) {
  const getOrganisationMemberByInternalId = useOrganisationStore(
    (state) => state.getOrganisationMemberByInternalId
  );
  const getFunkItemByInternalId = useFunkStore((state) => state.getFunkItemByInternalId);

  const bulkUser = getOrganisationMemberByInternalId(bulk.userId)?.user;
  return (
    <div className="text-xl flex flex-row items-center p-2 gap-2 bg-thw-50 border-thw-500 border-2 shadow-sm rounded-2xl transition-colors hover:cursor-pointer overflow-x-auto">
      <div className="text-2xl">{eventTypeToEmoji(bulk.eventType)}</div>
      <div className="flex flex-col gap-0 w-full">
        <div className="flex flex-row gap-2 justify-between w-full">
          <div className="text-nowrap text-sm">
            <span className="italic">{userToFriendlyString(bulkUser)}</span>
            {' am '}
            <span>{dateToFriendlyString(new Date(bulk.date))}</span>
          </div>
          <InventarItemEventTypeBadge type={bulk.eventType} />
        </div>
        <ul className="pl-3 flex flex-col justify-start w-full text-sm text-gray-500 list-disc">
          <li>{batteryCountToFriendlyString(bulk.batteryCount)}</li>
          <li>
            {bulk.events
              .map((event) => getFunkItemByInternalId(event.event.funkItemId)?.deviceId)
              .sort()
              .join(', ')}
          </li>
        </ul>
      </div>
    </div>
  );
}
