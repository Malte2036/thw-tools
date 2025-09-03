'use client';

import { leaveOrganisation } from '@/api/organisation/organisationApi';
import { generateInviteLink } from '@/api/organisation/organisationModels';
import { userToFriendlyString } from '@/api/user/userModels';
import { createVehicle } from '@/api/vehicle/vehicleApi';
import Button from '@/components/base/Button';
import Card from '@/components/base/Card';
import Table from '@/components/base/Table';
import AddVehicleDialog from '@/components/dialog/AddVehicleDialog';
import { useOrganisationStore } from '@/provider/store/organisationStore';
import { useVehicleStore } from '@/provider/store/vehicleStore';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function OrganisationPage() {
  const { getAccessToken, getIdToken } = useKindeAuth();
  const { organisation, setOrganisation } = useOrganisationStore();

  const [showAddVehicleDialog, setShowAddVehicleDialog] = useState(false);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);

  const vehicles = useVehicleStore((state) => state.vehicles);
  console.log('vehicles', vehicles);

  const memberTableValues = useMemo(() => {
    return organisation?.members.map((member) => [userToFriendlyString(member.user)]) ?? [];
  }, [organisation?.members]);

  if (!organisation) {
    return <div>Organisation not found</div>;
  }

  const leaveOrg = async () => {
    const accessToken = await getAccessToken();
    const idToken = await getIdToken();
    if (!accessToken || !idToken) {
      throw new Error('No access token or id token');
    }

    await leaveOrganisation({
      idToken,
      token: accessToken,
    });

    setOrganisation(null);
    toast.success('Organisation verlassen!');
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(generateInviteLink(organisation));

    toast.info('Einladungslink kopiert');
  };

  const shareInviteLink = async () => {
    try {
      await navigator.share({
        title: `Einladungslink - ${organisation.name}`,
        url: generateInviteLink(organisation),
      });

      toast.info('Einladungslink geteilt');
    } catch (error) {
      console.error('Error sharing link', error);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <Card title="Organisation">Name: {organisation.name}</Card>
      <Card title={`Mitglieder (${organisation.members.length})`}>
        <Table header={['Name']} values={memberTableValues} />
        <div className="mt-3">
          <Button type="secondary" onClick={leaveOrg}>
            Organisation verlassen
          </Button>
        </div>
      </Card>

      <Card title="Einladungslink">
        <div className="flex flex-col gap-4">
          <div className="text-gray-600">
            Mit diesem Link können andere THW-Mitglieder deiner Organisation beitreten:
          </div>
          <a
            className="break-all text-thw underline"
            href={generateInviteLink(organisation)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {generateInviteLink(organisation)}
          </a>
          <div className="flex gap-2">
            <Button type="secondary" onClick={copyInviteLink}>
              Link kopieren
            </Button>
            <Button type="secondary" onClick={shareInviteLink}>
              Link teilen
            </Button>
          </div>
        </div>
      </Card>

      <Card title="Fahrzeugverwaltung">
        <div className="flex flex-col gap-4">
          <div className="text-gray-600">
            Als Administrator kannst du hier Fahrzeuge für deine Organisation hinzufügen.
          </div>
          <div>
            <Button onClick={() => setShowAddVehicleDialog(true)}>
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                Fahrzeug hinzufügen
              </span>
            </Button>
          </div>
        </div>
      </Card>
      <AddVehicleDialog
        isOpen={showAddVehicleDialog}
        onClose={() => setShowAddVehicleDialog(false)}
        onSubmit={async (data) => {
          try {
            setIsAddingVehicle(true);

            const accessToken = await getAccessToken();
            const idToken = await getIdToken();
            if (!accessToken || !idToken) {
              throw new Error('No access token or id token');
            }

            await createVehicle(
              {
                idToken,
                token: accessToken,
              },
              data
            );

            setShowAddVehicleDialog(false);

            toast.success('Fahrzeug erfolgreich hinzugefügt');
          } catch (error) {
            console.error('Error creating vehicle:', error);
            if (error instanceof Error) {
              if (error.message.includes('license plate already exists')) {
                toast.error('Ein Fahrzeug mit diesem Kennzeichen existiert bereits.');
              } else {
                toast.error(`Fehler beim Erstellen des Fahrzeugs: ${error.message}`);
              }
            }
          } finally {
            setIsAddingVehicle(false);
          }
        }}
        isSubmitting={isAddingVehicle}
        onError={(message) => {
          console.log('error', message);
          toast.error(message);
        }}
      />
    </div>
  );
}
