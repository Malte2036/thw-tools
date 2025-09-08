'use client';

import { FunkItemDeviceId, isSearchStringInFunkItemEvent } from '@/api/funk/funkModels';
import { Input } from '@/components/base';
import LinkButton from '@/components/base/LinkButton';
import FunkItemEventItem from '@/components/funk/FunkItemEventItem';
import { useFunkStore } from '@/provider/store/funkStore';
import { useOrganisationStore } from '@/provider/store/organisationStore';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function FunkDevicePage() {
  const { deviceId } = useParams<{ deviceId: FunkItemDeviceId }>();
  const [search, setSearch] = useState('');

  const getOrganisationMemberByInternalId = useOrganisationStore(
    (state) => state.getOrganisationMemberByInternalId
  );
  const { funkItems, funkItemEventBulks, getAllFunkItemEventsByFunkItemDeviceId } = useFunkStore();

  const events = useMemo(
    () =>
      getAllFunkItemEventsByFunkItemDeviceId(deviceId)
        .filter((event) =>
          isSearchStringInFunkItemEvent(
            search,
            event,
            getOrganisationMemberByInternalId(event.userId)?.user
          )
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deviceId, funkItems, funkItemEventBulks, getAllFunkItemEventsByFunkItemDeviceId, search]
  );

  return (
    <div className="flex flex-col gap-2 p-4">
      <LinkButton url="/funk">Zurück zur Funkgeräteliste</LinkButton>

      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-2xl">Ereignisse für {deviceId}:</h1>

        <Input
          placeholder="Filtere nach Ereignissen..."
          value={search}
          onChange={(value) => setSearch(value)}
        />

        <div className="flex flex-col gap-2">
          {events.length === 0 ? (
            <div>Keine Ereignisse vorhanden.</div>
          ) : (
            events.map((event) => (
              <FunkItemEventItem
                key={event.id}
                event={event}
                deviceId={deviceId}
                isSelected={false}
                secondary
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
