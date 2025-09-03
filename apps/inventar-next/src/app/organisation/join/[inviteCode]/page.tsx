'use client';

import { joinOrganisation, leaveOrganisation } from '@/api/organisation/organisationApi';
import { Button, Dialog, ErrorDisplay, LoadingSpinner } from '@/components/base';
import { useOrganisationStore } from '@/provider/store/organisationStore';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import LinkButton from '@/components/base/LinkButton';
import { useEffect, useCallback, useState } from 'react';

export default function JoinOrganisationPage() {
  const { getAccessToken, getIdToken } = useKindeAuth();
  const router = useRouter();
  const { organisation, setOrganisation, isOrganisationFetched } = useOrganisationStore();

  const { inviteCode } = useParams<{ inviteCode: string }>();

  const [joinStatus, setJoinStatus] = useState<'idle' | 'joining' | 'joined'>('idle');

  const handleLeaveOrganisation = async () => {
    const accessToken = await getAccessToken();
    const idToken = await getIdToken();
    if (!accessToken || !idToken) {
      throw new Error('No access token or id token');
    }

    await leaveOrganisation({
      idToken,
      token: accessToken,
    }).then(() => setOrganisation(null));

    toast.success(`Du hast deine derzeitige Organisation verlassen.`);

    router.refresh();
  };

  const handleJoinOrganisation = useCallback(async () => {
    console.log('Starting joinOrganisation');
    setJoinStatus('joining');

    const accessToken = await getAccessToken();
    const idToken = await getIdToken();
    if (!accessToken || !idToken) {
      throw new Error('No access token or id token');
    }

    const organisation = await joinOrganisation(
      {
        idToken,
        token: accessToken,
      },
      inviteCode
    );
    setOrganisation(organisation);

    setJoinStatus('joined');
    toast.success(`Du bist der Organisation ${organisation.name} beigetreten.`);
  }, [inviteCode, getAccessToken, getIdToken, setOrganisation]);

  console.log('ORGANISATION', organisation?.name);

  useEffect(() => {
    if (!inviteCode || joinStatus !== 'idle' || !isOrganisationFetched || organisation) return;

    handleJoinOrganisation();
  }, [inviteCode, joinStatus, handleJoinOrganisation, organisation, isOrganisationFetched]);

  if (joinStatus === 'idle' && organisation) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <ErrorDisplay
          label={`Du bist bereits Mitglied einer Organisation (${organisation.name}). Verlasse diese, um der neuen Organisation beizutreten.`}
        />
        <div className="flex gap-2">
          <LinkButton type="secondary" url="/organisation" className="w-fit">
            Zur Organisation
          </LinkButton>
          <Button type="warning" onClick={() => handleLeaveOrganisation()} className="w-fit">
            Organisation verlassen
          </Button>
        </div>
      </div>
    );
  }

  if (joinStatus === 'joined' && organisation) {
    return (
      <Dialog title="Organisation beigetreten">
        <div slot="content" className="flex flex-col gap-2">
          <div>
            Du bist erfolgreich der Organisation &quot;
            <span className="font-bold">{organisation.name}</span>&quot; mit{' '}
            <span className="font-bold">{organisation.members.length} Mitgliedern </span>
            beigetreten.
          </div>
        </div>

        <div slot="footer">
          <Button onClick={() => router.push('/organisation')}>Zur Organisationsübersicht</Button>
        </div>
      </Dialog>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 items-center">
      <LoadingSpinner />
    </div>
  );
}
