import { User, UserSchema } from '@/api/user/userModels';
import { create } from 'zustand';

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user: User | null) => {
    if (!user) {
      set({ user: null });
      return;
    }

    const parsedUser = UserSchema.parse(user);
    set({ user: parsedUser });
  },
}));
