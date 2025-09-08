import { useOrganisationStore } from '@/provider/store/organisationStore';
import Card from '../base/Card';
import InfoItem from '../base/InfoItem';
import { useFunkStore } from '@/provider/store/funkStore';
import { Button } from '../base';
import { exportFunkItemEventBulksAsCsv } from '@/api/funk/funkApi';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { ApiRequestOptions } from '@/api/apiGeneric';
import LinkButton from '../base/LinkButton';

export default function FunkAdvancedTab() {
  const { getAccessToken, getIdToken } = useKindeAuth();

  const organisation = useOrganisationStore((state) => state.organisation);
  const { getBorrowedDevicesCount, getBorrowedBatteryCount, funkItems } = useFunkStore();

  if (!organisation) {
    return <div>Organisation not found</div>;
  }

  const exportInventarAsCsv = async () => {
    const accessToken = await getAccessToken();
    const idToken = await getIdToken();
    if (!accessToken || !idToken) {
      return;
    }

    const requestOptions: ApiRequestOptions = {
      token: accessToken,
      idToken,
    };

    const blob = await exportFunkItemEventBulksAsCsv(requestOptions);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventar_${organisation.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <Card title="Organisation">
        <InfoItem label="Name" value={organisation.name} />
      </Card>

      <Card title="Inventar Übersicht">
        <InfoItem
          label="Ausgeliehene Geräte"
          value={`${getBorrowedDevicesCount()} von ${funkItems?.length}`}
        />
        <InfoItem label="Ausgeliehene Batterien" value={getBorrowedBatteryCount().toString()} />
      </Card>

      <Card title="Exportieren">
        <Button onClick={exportInventarAsCsv}>Exportiere die Funkgeräteliste als CSV</Button>
      </Card>

      <Card title="Organisationsverwaltung">
        <div className="flex flex-col gap-4">
          <div className="text-gray-600">
            Verwalte deine Organisation, Mitglieder und Einladungen unter:
          </div>
          <LinkButton url="/organisation">Zur Organisationsverwaltung</LinkButton>
        </div>
      </Card>
    </div>
  );
}
