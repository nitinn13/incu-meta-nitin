// src/components/StartupProtectedRoute.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useUserAuth } from "@/contexts/StartupAuthContext";

export const StartupProtectedRoute = () => {
  const { isAuthenticated } = useUserAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/startup/login" replace />;
  }

  return <Outlet />;
};
