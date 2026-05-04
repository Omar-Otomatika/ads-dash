import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "@/features/landing/LandingPage";
import SignInPage from "@/features/auth/components/SignInPage";
import SignUpPage from "@/features/auth/components/SignUpPage";
import { AuthenticateWithRedirectCallback } from "@clerk/react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ConnectionsPage } from "@/features/connections/components/ConnectionsPage";
import { CollaboratorsPage } from "@/features/collaborators/components/CollaboratorsPage";
import { DashboardPage } from "@/features/dashboard/components/DashboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "/sso-callback",
    element: <AuthenticateWithRedirectCallback />,
  },
  {
    path: "/connections",
    element: (
      <DashboardLayout>
        <ConnectionsPage />
      </DashboardLayout>
    ),
  },
  {
    path: "/collaborators",
    element: (
      <DashboardLayout>
        <CollaboratorsPage />
      </DashboardLayout>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <DashboardLayout>
        <DashboardPage />
      </DashboardLayout>
    ),
  },
]);
