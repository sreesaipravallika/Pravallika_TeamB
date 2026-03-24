import { Navigate } from "react-router-dom";
import { getCurrentUser, type UserRole } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const user = getCurrentUser();

  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role - redirect to their dashboard
  if (!allowedRoles.includes(user.role)) {
    if (user.role === "customer") return <Navigate to="/dashboard" replace />;
    if (user.role === "provider") return <Navigate to="/provider-dashboard" replace />;
    if (user.role === "admin") return <Navigate to="/admin-dashboard" replace />;
  }

  // Correct role - render the protected content
  return <>{children}</>;
}
