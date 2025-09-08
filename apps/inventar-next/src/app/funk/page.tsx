'use client';

import { Tabs } from '@/components/base';
import AddDevice from '@/components/scan/AddDevice';
import FunkAdvancedTab from '@/components/scan/FunkAdvancedTab';
import FunkBulkHistoryTab from '@/components/scan/FunkBulkHistoryTab';
import FunkListTab from '@/components/scan/FunkListTab';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type FunkTab = 'Funkgeräte' | 'Ausleihhistorie' | 'Erweitert';

export default function FunkPage() {
  const [selectedTab, setSelectedTab] = useState<FunkTab>('Funkgeräte');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tab = searchParams.get('tab');
    console.log('tab', tab);
    if (tab) {
      setSelectedTab(tab as FunkTab);
    }
  }, [searchParams]);

  const renderTab = () => {
    if (selectedTab === 'Ausleihhistorie') {
      return <FunkBulkHistoryTab />;
    }

    if (selectedTab === 'Erweitert') {
      return <FunkAdvancedTab />;
    }

    return <FunkListTab />;
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <AddDevice />

      <div className="flex w-full justify-center">
        <Tabs
          initialSelected={selectedTab}
          items={['Funkgeräte', 'Ausleihhistorie', 'Erweitert'] satisfies FunkTab[]}
          onSelect={(event) => {
            const item = event.detail;
            setSelectedTab(item);
            router.push(`/funk?tab=${item}`);
          }}
        />
      </div>
      {renderTab()}
    </div>
  );
}
