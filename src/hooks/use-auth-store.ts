import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  userId: string | null;
  setUserId: (id: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      setUserId: (id) => {
        console.log('Setting userId in store:', id); // Log for debugging
        set({ userId: id });
      },
      clearAuth: () => {
        console.log('Clearing userId in store'); // Log for debugging
        set({ userId: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
