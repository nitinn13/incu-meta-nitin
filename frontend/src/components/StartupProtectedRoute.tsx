// src/components/StartupProtectedRoute.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useStartupAuth } from "@/contexts/StartupAuthContext";
// import { Star } from "lucide-react";
import { StartupLayout } from "./layouts/StartupLayout";

export const StartupProtectedRoute = () => {
  const { isAuthenticated, loading } = useStartupAuth();

  // Optional: Show loading while checking auth
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner component
  }

  if (!isAuthenticated()) {
    return <Navigate to="/startup/login" replace />;
  }

  return(
    <StartupLayout>
    <Outlet />
    </StartupLayout>

  );
};
