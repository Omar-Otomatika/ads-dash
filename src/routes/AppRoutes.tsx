import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LandingPage } from "@/features/landing/LandingPage";
import SignInPage from "@/features/auth/components/SignInPage";

const routes = createBrowserRouter([
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
    element: <div>Sign Up Page (TBD)</div>,
  },
]);


const Routes = () => {
  return (
    <RouterProvider router={routes} />
  )
}

export default Routes;