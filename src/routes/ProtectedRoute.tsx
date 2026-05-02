import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Spinner } from "../components/Spinner";

//SI NO ESTA EL USUARIO LOGUEADO NO TE DEJA ACCEDER
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();

  if (loading) return <Spinner />;
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
