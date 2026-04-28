import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  userId: string | null;
  clerkToken: string | null; // For Supabase Function Auth
  accessToken: string | null; // Adlyfy Access Token
  refreshToken: string | null; // Adlyfy Refresh Token
  setUserId: (id: string | null) => void;
  setClerkToken: (token: string | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      clerkToken: null,
      accessToken: null,
      refreshToken: null,
      setUserId: (id) => set({ userId: id }),
      setClerkToken: (token) => set({ clerkToken: token }),
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      clearAuth: () => set({ userId: null, clerkToken: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
