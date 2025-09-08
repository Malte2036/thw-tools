import { useMemo, useState } from 'react';
import { Input } from '../base';
import { useFunkStore } from '@/provider/store/funkStore';
import {
  eventTypeToFriendlyString,
  FunkItem,
  FunkItemEvent,
  isSearchStringInFunkItem,
} from '@/api/funk/funkModels';
import { useOrganisationStore } from '@/provider/store/organisationStore';
import FunkItemEventItem from './FunkItemEventItem';

type FilteredData = {
  item: FunkItem;
  lastEvent: FunkItemEvent;
};

export default function FunkListTab() {
  const [searchedDeviceId, setSearchedDeviceId] = useState('');
  const [isBorrowedExpanded, setIsBorrowedExpanded] = useState(true);
  const [isAvailableExpanded, setIsAvailableExpanded] = useState(true);

  const { funkItems, getLastFunkItemEventByFunkItemInternalId } = useFunkStore();
  const getOrganisationMemberByInternalId = useOrganisationStore(
    (state) => state.getOrganisationMemberByInternalId
  );

  const filteredItems = useMemo(() => {
    return (
      funkItems
        ?.map((item) => {
          const lastFunkItemEvent = getLastFunkItemEventByFunkItemInternalId(item.id);
          if (!lastFunkItemEvent) return null;
          return {
            item,
            lastEvent: lastFunkItemEvent,
          } satisfies FilteredData;
        })
        .filter((data): data is FilteredData => !!data)
        .filter((data) =>
          isSearchStringInFunkItem(
            searchedDeviceId,
            data.item,
            data.lastEvent,
            getOrganisationMemberByInternalId(data.lastEvent.userId)?.user
          )
        ) ?? []
    );
  }, [
    searchedDeviceId,
    funkItems,
    getOrganisationMemberByInternalId,
    getLastFunkItemEventByFunkItemInternalId,
  ]);

  const borrowedItems = useMemo(() => {
    return filteredItems.filter((item) => item.lastEvent?.type === 'borrowed');
  }, [filteredItems]);

  const availableItems = useMemo(() => {
    return filteredItems.filter((item) => item.lastEvent?.type === 'returned');
  }, [filteredItems]);

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Geräte suchen..."
        value={searchedDeviceId}
        onChange={(value) => setSearchedDeviceId(value)}
      />

      <div className="flex flex-col gap-2">
        <button
          className="flex items-center gap-2 w-fit"
          onClick={() => setIsBorrowedExpanded((state) => !state)}
        >
          <h2 className="font-bold text-xl text-thw first-letter:uppercase">
            {eventTypeToFriendlyString('borrowed')} ({borrowedItems.length} / {filteredItems.length}
            )
          </h2>
          <svg
            className="w-6 h-6 transform transition-transform {isBorrowedExpanded ? 'rotate-180' : ''}"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isBorrowedExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
            {borrowedItems.length === 0 && (
              <p className="text-gray-500">Keine ausgeliehenen Geräte vorhanden.</p>
            )}
            {borrowedItems.map((data) => (
              <FunkItemEventItem
                key={data.item.id}
                event={data?.lastEvent}
                deviceId={data?.item?.deviceId}
                isSelected={false}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <button
          className="flex items-center gap-2 w-fit"
          onClick={() => setIsAvailableExpanded((state) => !state)}
        >
          <h2 className="font-bold text-xl text-thw first-letter:uppercase">
            {eventTypeToFriendlyString('returned')} ({availableItems.length} /{' '}
            {filteredItems.length})
          </h2>
          <svg
            className="w-6 h-6 transform transition-transform {isAvailableExpanded ? 'rotate-180' : ''}"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isAvailableExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
            {availableItems.length === 0 && (
              <p className="text-gray-500">Keine verfügbaren Geräte vorhanden.</p>
            )}
            {availableItems.map((data) => (
              <FunkItemEventItem
                key={data.item.id}
                event={data.lastEvent}
                deviceId={data.item.deviceId}
                isSelected={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
