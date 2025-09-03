import { Organisation, OrganisationSchema } from '@/api/organisation/organisationModels';
import { create } from 'zustand';

interface OrganisationStore {
  organisation: Organisation | null;
  isOrganisationFetched: boolean;
  setOrganisation: (organisation: Organisation | null) => void;
}

export const useOrganisationStore = create<OrganisationStore>((set) => ({
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
}));
