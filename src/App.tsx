import AppRouter from "./routes/AppRouter";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    //VERIFICACION DE LA SESION ACTUAL VERIFICA CAMBIOS EN EL AUTH
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, []);

  return <AppRouter />;
}

export default App;
