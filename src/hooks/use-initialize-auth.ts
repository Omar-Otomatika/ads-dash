import { useEffect } from 'react';
import { useAuthStore } from './use-auth-store';
import { authService } from '@/features/auth/services/auth-service';

export function useInitializeAuth() {
  const { userId, accessToken, setTokens } = useAuthStore();

  useEffect(() => {
    const fetchTokens = async () => {
      if (userId && !accessToken) {
        try {
          const response = await authService.getTokens(userId);
          const { accessToken: newAccess, refreshToken: newRefresh } = response.data;
          setTokens(newAccess, newRefresh);
        } catch (error) {
          console.error('Failed to initialize auth tokens:', error);
        }
      }
    };

    fetchTokens();
  }, [userId, accessToken, setTokens]);
}
