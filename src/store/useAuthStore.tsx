import { create } from "zustand";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

//TIPADO
export interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  initialize: () => () => void; // retorna el unsubscribe
}

//1ER STORE
export const useAuthStore = create<AuthState>((set) => ({
  //ESTADOS
  user: null,
  loading: true,

  //FUNCIONES
  setUser: (user) => set({ user }),
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
  initialize: () => {
    //RECUPERA LA SESION UNA VEZ INICIADA LA APP
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ user: session?.user ?? null, loading: false });
    });

    //ESCUCHA CAMBIOS EN LA AUTENTICACION
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null, loading: false });
    });

    //LIMPIA LA SESSION
    return () => subscription.unsubscribe();
  },
}));
