// src/pages/AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  // useEffect(() => {
  //   supabase.auth.onAuthStateChange((event, session) => {
  //     if (event === "SIGNED_IN" && session) {
  //       //SESION CREADA EXITOSAMENTE REDIRIGE AL DASHBOARD
  //       navigate("/dashboard", { replace: true });
  //     } else {
  //       //ALGO SALIO MAL DE NUEVO AL LOGIN
  //       navigate("/login", { replace: true });
  //     }
  //   });
  // }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#080c0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Verificando tu cuenta...</p>
      </div>
    </div>
  );
}
