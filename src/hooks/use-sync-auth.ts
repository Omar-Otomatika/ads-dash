import { useEffect } from 'react';
import { useAuth } from '@clerk/react';
import { useAuthStore } from './use-auth-store';

/**
 * Hook to keep the Zustand auth store in sync with Clerk's authentication state.
 * This ensures that userId is always available in the store for non-hook usage
 * (like axios interceptors) and handles social logins/reloads automatically.
 */
export function useSyncAuth() {
  const { userId, isLoaded, getToken } = useAuth();
  const setUserId = useAuthStore((state) => state.setUserId);
  const setClerkToken = useAuthStore((state) => state.setClerkToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    const sync = async () => {
      if (isLoaded) {
        if (userId) {
          setUserId(userId);
          const token = await getToken();
          setClerkToken(token);
        } else {
          clearAuth();
        }
      }
    };
    sync();
  }, [userId, isLoaded, setUserId, setClerkToken, clearAuth, getToken]);
}

/**
 * Component version of the sync hook for usage in the app root.
 */
export function AuthSync() {
  useSyncAuth();
  return null;
}
