import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';

interface UserState {
  session: Session | null;
  user: User | null;
  token: string | null;
  setSession: (session: Session | null) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  session: null,
  user: null,
  token: null,
  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
      token: session?.access_token ?? null,
    }),
  setUser: (user) => set({ user }),
  logout: () => set({ session: null, user: null, token: null }),
}));