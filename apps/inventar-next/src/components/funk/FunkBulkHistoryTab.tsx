import { useMemo, useState } from 'react';
import { Input } from '../base';
import { useFunkStore } from '@/provider/store/funkStore';
import FunkItemEventBulkItem from './FunkItemEventBulkItem';
import { FunkItemDeviceId, isSearchStringInFunkItemEventBulk } from '@/api/funk/funkModels';
import { useOrganisationStore } from '@/provider/store/organisationStore';

export default function FunkBulkHistoryTab() {
  const [searchTerm, setSearchTerm] = useState('');

  const { funkItemEventBulks } = useFunkStore();
  const getOrganisationMemberByInternalId = useOrganisationStore(
    (state) => state.getOrganisationMemberByInternalId
  );
  const getFunkItemByInternalId = useFunkStore((state) => state.getFunkItemByInternalId);

  const filteredBulks = useMemo(() => {
    return (
      funkItemEventBulks
        ?.filter((item) =>
          isSearchStringInFunkItemEventBulk(
            searchTerm,
            item,
            getOrganisationMemberByInternalId(item.userId)?.user,
            // TODO: get inventory items, once they are implemented
            item.events
              .map((event) => getFunkItemByInternalId(event.event.funkItemId)?.deviceId)
              .filter((deviceId): deviceId is FunkItemDeviceId => deviceId !== undefined)
          )
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) ?? []
    );
  }, [funkItemEventBulks, searchTerm, getOrganisationMemberByInternalId, getFunkItemByInternalId]);

  const renderBulks = () => {
    if (!filteredBulks || filteredBulks.length === 0) {
      return <div>Keine Historie vorhanden.</div>;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredBulks.map((bulk) => (
          <FunkItemEventBulkItem key={bulk.id} bulk={bulk} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Input
          placeholder="Historie durchsuchen..."
          value={searchTerm}
          onChange={(value) => setSearchTerm(value)}
        />
        {renderBulks()}
      </div>
    </div>
  );
}
