import {
  FunkItem,
  FunkItemEventBulk,
  FunkItemEventBulkSchema,
  FunkItemSchema,
} from '@/api/funk/funkModels';
import { create } from 'zustand';

interface FunkStore {
  funkItems: FunkItem[] | null;
  funkItemEventBulks: FunkItemEventBulk[] | null;
  setFunkItems: (funkItems: FunkItem[] | null) => void;
  setFunkItemEventBulks: (funkItemEventBulks: FunkItemEventBulk[] | null) => void;
}

export const useFunkStore = create<FunkStore>((set) => ({
  funkItems: null,
  funkItemEventBulks: null,
  setFunkItems: (funkItems: FunkItem[] | null) => {
    if (!funkItems) {
      set({ funkItems: null });
      return;
    }

    const parsedFunkItems = FunkItemSchema.array().parse(funkItems);
    set({ funkItems: parsedFunkItems });
  },
  setFunkItemEventBulks: (funkItemEventBulks: FunkItemEventBulk[] | null) => {
    if (!funkItemEventBulks) {
      set({ funkItemEventBulks: null });
      return;
    }

    const parsedFunkItemEventBulks = FunkItemEventBulkSchema.array().parse(funkItemEventBulks);
    set({ funkItemEventBulks: parsedFunkItemEventBulks });
  },
}));
