import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hook";
import type { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
  role?: "admin" | "coach" | "user";
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user, token } = useAppSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
