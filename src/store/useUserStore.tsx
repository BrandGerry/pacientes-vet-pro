import { create } from "zustand";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export interface Profile {
  id: string;
  email: string;
  username: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: string | null;
  created_at: Date | null;
  status: string;
}

//TIPADO
export interface UserState {
  userProfile: Profile | null;
  loading: boolean;
  error: string | null;
  activeUsersCount: number;
  allUsers: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  reset: () => void;
}

//1ER STORE
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // ESTADOS
      userProfile: null,
      loading: false,
      error: null,
      activeUsersCount: 0,
      allUsers: async () => {
        set({ loading: true, error: null });

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          set({
            error: authError?.message || "No authenticated user",
            loading: false,
          });
          return;
        }

        // 👇 Query para contar usuarios con status "active"
        const { count, error: countError } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .eq("status", "active");

        if (countError) {
          set({ error: countError.message, loading: false });
          return;
        }

        set({
          activeUsersCount: count ?? 0,
          loading: false,
        });
      },
      // FUNCIONES
      fetchProfile: async () => {
        set({ loading: true, error: null });

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          set({
            error: authError?.message || "No authenticated user",
            loading: false,
          });
          return;
        }

        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          set({ error: error.message, loading: false });
          return;
        }

        set({ userProfile: data, loading: false });
      },

      // ACTUALIZAR PERFIL
      updateProfile: async (data) => {
        set({ loading: true, error: null });

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          set({ error: "No authenticated user", loading: false });
          return;
        }

        const { error } = await supabase
          .from("users")
          .update(data)
          .eq("id", user.id);

        if (error) {
          set({ error: error.message, loading: false });
          return;
        }

        await get().fetchProfile();
      },

      // RESET (logout)
      reset: () =>
        set({
          userProfile: null,
          loading: false,
          error: null,
          activeUsersCount: 0,
        }),
    }),
    {
      name: "user-profile-storage",
      partialize: (state) => ({ userProfile: state.userProfile }),
    }
  )
);
