import { Navigate } from "react-router-dom";
import { AuthState, useAuthStore } from "../store/useAuthStore";

function RootRedirect() {
  const user = useAuthStore((state: AuthState) => state.user);
  //SI HAY USUARIO LO MANDA A DASHBOARD
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  //SI NO, A LOGIN
  return <Navigate to="/login" replace />;
}

export default RootRedirect;
