import { useAuth } from "@clerk/react";
import { useEffect } from "react";
import { useAuthStore } from "@/hooks/use-auth-store";

export const AuthSync = () => {
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

  return null;
};
