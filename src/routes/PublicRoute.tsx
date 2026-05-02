import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;
