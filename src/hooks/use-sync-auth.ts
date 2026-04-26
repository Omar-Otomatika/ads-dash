import { useEffect } from 'react';
import { useAuth } from '@clerk/react';
import { useAuthStore } from './use-auth-store';

/**
 * Hook to keep the Zustand auth store in sync with Clerk's authentication state.
 * This ensures that userId is always available in the store for non-hook usage
 * (like axios interceptors) and handles social logins/reloads automatically.
 */
export function useSyncAuth() {
  const { userId, isLoaded } = useAuth();
  const setUserId = useAuthStore((state) => state.setUserId);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    if (isLoaded) {
      if (userId) {
        setUserId(userId);
      } else {
        clearAuth();
      }
    }
  }, [userId, isLoaded, setUserId, clearAuth]);
}

/**
 * Component version of the sync hook for usage in the app root.
 */
export function AuthSync() {
  useSyncAuth();
  return null;
}
