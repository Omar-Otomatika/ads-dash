import { useAuth, useOrganization } from "@clerk/react";
import { useEffect } from "react";
import { useAuthStore } from "@/hooks/use-auth-store";

export const AuthSync = () => {
  const { userId, isLoaded: isAuthLoaded } = useAuth();
  const { organization, memberships, isLoaded: isOrgLoaded } = useOrganization({
    memberships: {
      pageSize: 50,
    },
  });
  const setUserId = useAuthStore((state) => state.setUserId);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    // 1. Wait for Auth and Org object to load
    if (!isAuthLoaded || !isOrgLoaded) return;

    let targetUserId = userId;

    if (organization) {
      // 2. If in an org, we MUST wait for memberships to be fully populated 
      // to ensure we can actually find the admin.
      if (!memberships?.data || memberships.data.length === 0) {
        // If we are in an org but no members are listed yet, wait.
        return;
      }

      // 3. Try to find the admin ID in various possible fields
      const org = organization as any;
      const adminIdFromOrg = org.createdBy || org.created_by || org.adminId || org.ownerId;

      // 4. Fallback to searching memberships for an 'admin' role
      const adminFromMemberships = memberships.data.find((m) => m.role === "org:admin");

      const adminUserId = adminIdFromOrg || adminFromMemberships?.publicUserData?.userId;

      if (adminUserId) {
        targetUserId = adminUserId;
      }
    }

    if (targetUserId) {
      setUserId(targetUserId);
    } else {
      clearAuth();
    }
  }, [
    userId, 
    organization?.id, 
    memberships?.data, 
    isAuthLoaded, 
    isOrgLoaded, 
    setUserId, 
    clearAuth
  ]);

  return null;
};

