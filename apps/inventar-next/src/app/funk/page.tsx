'use client';

import { Tabs } from '@/components/base';
import AddDevice from '@/components/scan/AddDevice';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type FunkTab = 'Funkgeräte' | 'Ausleihhistorie' | 'Erweitert';

export default function FunkPage() {
  const [selectedTab, setSelectedTab] = useState<FunkTab>('Funkgeräte');
  const params = useParams();
  const router = useRouter();
  useEffect(() => {
    const tab = params.tab;
    if (tab) {
      setSelectedTab(tab as FunkTab);
    }
  }, [params.tab]);

  console.log(selectedTab);

  return (
    <div className="flex flex-col gap-4 p-4">
      <AddDevice />

      <div className="flex w-full justify-center">
        <Tabs
          items={['Funkgeräte', 'Ausleihhistorie', 'Erweitert'] satisfies FunkTab[]}
          onSelect={(item) => {
            setSelectedTab(item as FunkTab);
            router.push(`/funk?tab=${item}`);
          }}
          initialSelected={selectedTab}
        />
      </div>
      {/* 
{#await $funk.fetching}
    <LoadingSpinner />
{:then}
    {#if selectedTab === 'bulkHistory'}
        <FunkBulkHistoryTab />
    {:else if selectedTab === 'advanced'}
        <FunkAdvancedTab />
    {:else}
        <FunkListTab />
    {/if}
{:catch error}
    <ErrorState
        label="Beim Abrufen der Funkgeräte aus der Datenbank ist leider ein Fehler aufgetreten."
        {error}
    />
{/await} */}
    </div>
  );
}
