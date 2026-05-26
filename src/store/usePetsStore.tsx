import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";

export interface Pets {
  id: string;
  created_at: Date;
  owner_id: string;
  name: string;
  specie: string;
  breed: string;
  owner_name: string;
}

export interface Owners {
  id: string;
  created_at: Date;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
}

export interface OwnerWithPets {
  id: string;
  created_at: Date;
  user_id: string;
  email: string | null;
  name: string;
  phone: string | null;
  pets: Pets[];
}

//TIPADO
export interface UserState {
  pets: OwnerWithPets[] | null;
  loading: boolean;
  error: string | null;
  fetchPets: () => Promise<void>;
  insertPet: (data: Partial<Pets>) => Promise<void>;
  insertOwner: (data: Partial<Owners>) => Promise<void>;
  updatePets: (petId: string, data: Partial<Pets>) => Promise<void>;
  updateOwner: (ownerId: string, data: Partial<Owners>) => Promise<void>;
  reset: () => void;
}

//1ER STORE
export const usePetsStore = create<UserState>()(
  persist(
    (set, get) => ({
      // ESTADOS
      pets: null,
      loading: false,
      error: null,
      // FUNCIONES
      fetchPets: async () => {
        set({ loading: true, error: null });

        const user = useAuthStore.getState().user;

        if (!user) {
          set({
            error: "No authenticated user",
            loading: false,
          });
          return;
        }

        const { data, error } = await supabase
          .from("owners")
          .select(
            `
      *,
      pets (*)
    `
          )
          .eq("user_id", user.id);

        if (error) {
          set({ error: error.message, loading: false });
          return;
        }

        set({ pets: data, loading: false });
      },
      insertPet: async (petData) => {
        set({ loading: true, error: null });

        const user = useAuthStore.getState().user;

        if (!user) {
          set({
            error: "No authenticated user",
            loading: false,
          });
          return;
        }

        const { data, error } = await supabase
          .from("pets")
          .insert([
            {
              owner_id: petData.owner_id,
              name: petData.name,
              specie: petData.specie,
              breed: petData.breed,
            },
          ])
          .select()
          .single();

        if (error) {
          set({
            error: error.message,
            loading: false,
          });
          return;
        }

        set({ loading: false });

        // opcional refrescar data
        await get().fetchPets();
      },
      insertOwner: async (ownerData) => {
        set({ loading: true, error: null });
        const user = useAuthStore.getState().user;

        if (!user) {
          set({
            error: "No authenticated user",
            loading: false,
          });
          return;
        }

        const { data, error } = await supabase
          .from("owners")
          .insert([
            {
              user_id: user.id,
              name: ownerData.name,
              email: ownerData.email,
              phone: ownerData.phone,
            },
          ])
          .select()
          .single();

        if (error) {
          set({
            error: error.message,
            loading: false,
          });
          return;
        }

        set({ loading: false });

        // opcional refrescar data
        await get().fetchPets();
      },
      // ACTUALIZAR PERFIL
      updatePets: async (petId, data) => {
        set({ loading: true, error: null });

        const user = useAuthStore.getState().user;

        if (!user) {
          set({
            error: "No authenticated user",
            loading: false,
          });
          return;
        }

        const { error } = await supabase
          .from("pets")
          .update(data)
          .eq("id", petId);

        if (error) {
          set({
            error: error.message,
            loading: false,
          });
          return;
        }

        await get().fetchPets();

        set({ loading: false });
      },
      updateOwner: async (ownerId, data) => {
        set({ loading: true, error: null });

        const user = useAuthStore.getState().user;

        if (!user) {
          set({
            error: "No authenticated user",
            loading: false,
          });
          return;
        }

        const { error } = await supabase
          .from("owners")
          .update(data)
          .eq("id", ownerId);

        if (error) {
          set({
            error: error.message,
            loading: false,
          });
          return;
        }

        await get().fetchPets();

        set({ loading: false });
      },
      reset: () =>
        set({
          pets: null,
          loading: false,
          error: null,
        }),
    }),
    {
      name: "pets-profile-storage",
      partialize: (state) => ({ pets: state.pets }),
    }
  )
);
