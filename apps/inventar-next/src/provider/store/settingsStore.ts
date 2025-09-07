import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  selectedCamera: string | null;
  setSelectedCamera: (cameraId: string | null) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      selectedCamera: null,
      setSelectedCamera: (cameraId: string | null) => set({ selectedCamera: cameraId }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
