import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { router } from "@/routes/AppRoutes";
import { AuthSync } from "@/hooks/use-sync-auth";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthSync />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
