import { Fragment } from "react";
import { Navigate, Outlet } from "react-router-dom"; // CUSTOM DEFINED HOOK

import useAuth from "@/hooks/useAuth";

const GuestGuard = ({
  children
}) => {
  const {
    isAuthenticated
  } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return <Fragment>{children || <Outlet />}</Fragment>;
};

export default GuestGuard;