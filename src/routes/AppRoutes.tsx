import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "@/features/landing/LandingPage";
import SignInPage from "@/features/auth/components/SignInPage";
import SignUpPage from "@/features/auth/components/SignUpPage";
import { AuthenticateWithRedirectCallback } from "@clerk/react";

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
]);
