import { create } from "zustand";

interface User {
  id: number;
  full_name: string;
  email: string;
  type_account: string;
  is_completed: boolean;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
