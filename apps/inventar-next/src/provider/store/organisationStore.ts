import {
  Organisation,
  OrganisationMember,
  OrganisationSchema,
} from '@/api/organisation/organisationModels';
import { UserId } from '@/api/user/userModels';
import { create } from 'zustand';

interface OrganisationStore {
  organisation: Organisation | null;
  isOrganisationFetched: boolean;
  setOrganisation: (organisation: Organisation | null) => void;
  getOrganisationMemberByInternalId: (internalId: UserId) => OrganisationMember | null;
}

export const useOrganisationStore = create<OrganisationStore>((set, get) => ({
  organisation: null,
  isOrganisationFetched: false,
  setOrganisation: (organisation: Organisation | null) => {
    if (!organisation) {
      set({ organisation: null, isOrganisationFetched: true });
      return;
    }

    const parsedOrganisation = OrganisationSchema.parse(organisation);
    set({ organisation: parsedOrganisation, isOrganisationFetched: true });
  },
  getOrganisationMemberByInternalId: (internalId: UserId) => {
    return get().organisation?.members.find((member) => member.userId === internalId) ?? null;
  },
}));
