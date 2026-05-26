import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";
import { Pets } from "./usePetsStore";

export interface Appointments {
  id: string;
  created_at: Date;
  pet_id: string;
  veterinarian_id: string;
  date: Date;
  reason: string;
  status: string;
  date_end: Date;
}

export interface Medicals {
  id: string;
  created_at: Date;
  pet_id: string;
  veterinarian_id: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  notes: string | null;
}

export interface AppointmentsToday {
  id: string;
  created_at: Date;
  pet_id: string;
  veterinarian_id: string;
  date: Date;
  reason: string;
  status: string;
  pets: Pets;
}

export interface LastAppointments {
  id: string;
  created_at: Date;
  pet_id: string;
  veterinarian_id: string;
  date: Date;
  reason: string;
  status: string;
  date_end: string;
  pets: Pets;
}

//TIPADO
export interface UserState {
  medicals: Medicals[] | null;
  appointments: Appointments[] | null;
  appointmentsToday: AppointmentsToday[] | null;
  lastAppointments: LastAppointments[] | null;
  loadingMedical: boolean;
  loadingAppointment: boolean;
  errorMedicals: string | null;
  errorAppointmen: string | null;
  error: string | null;
  fetchMedicals: () => Promise<void>;
  fetchAppointments: () => Promise<void>;
  fetchAppointmentsToday: () => Promise<void>;
  fetchLastAppointments: () => Promise<void>;
  insertMedical: (data: Partial<Medicals>) => Promise<void>;
  insertAppointment: (data: Partial<Appointments>) => Promise<void>;
  updateMedical: (medicalId: string, data: Partial<Medicals>) => Promise<void>;
  updateAppointment: (
    appointmentId: string,
    data: Partial<Appointments>
  ) => Promise<void>;
  reset: () => void;
}

//1ER STORE
export const useAppointmentStore = create<UserState>()(
  persist(
    (set, get) => ({
      // ESTADOS
      medicals: null,
      appointments: null,
      appointmentsToday: null,
      lastAppointments: null,
      loadingMedical: false,
      loadingAppointment: false,
      errorMedicals: null,
      errorAppointmen: null,
      error: null,
      // FUNCIONES
      fetchMedicals: async () => {
        set({ loadingMedical: true, errorMedicals: null });

        const user = useAuthStore.getState().user;

        if (!user) {
          set({
            error: "No authenticated user",
            loadingMedical: false,
          });
          return;
        }
        const { data, error } = await supabase
          .from("medical")
          .select("*")
          .eq("veterinarian_id", user.id);

        if (error) {
          set({ errorMedicals: error.message, loadingMedical: false });
          return;
        }
        set({ medicals: data, loadingMedical: false });
      },
      fetchAppointments: async () => {
        set({ loadingAppointment: true, errorMedicals: null });

        const user = useAuthStore.getState().user;

        if (!user) {
          set({
            error: "No authenticated user",
            loadingAppointment: false,
          });
          return;
        }
        const { data, error } = await supabase
          .from("appointments")
          .select("*")
          .eq("veterinarian_id", user.id);

        if (error) {
          set({ errorAppointmen: error.message, loadingAppointment: false });
          return;
        }

        set({ appointments: data, loadingAppointment: false });
      },
      fetchAppointmentsToday: async () => {
        set({ loadingAppointment: true, errorMedicals: null });

        const user = useAuthStore.getState().user;

        if (!user) {
          set({
            error: "No authenticated user",
            loadingAppointment: false,
          });
          return;
        }

        // Inicio del día
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Inicio del siguiente día
        const endOfDay = new Date();
        endOfDay.setHours(24, 0, 0, 0);

        const { data, error } = await supabase
          .from("appointments")
          .select(
            `
          *,
          pets (*)
        `
          )
          .eq("veterinarian_id", user.id)
          .gte("date", startOfDay.toISOString())
          .lt("date", endOfDay.toISOString());

        if (error) {
          set({
            errorAppointmen: error.message,
            loadingAppointment: false,
          });
          return;
        }

        set({
          appointmentsToday: data,
          loadingAppointment: false,
        });
      },
      fetchLastAppointments: async () => {
        set({ loadingAppointment: true, errorMedicals: null });

        const user = useAuthStore.getState().user;

        if (!user) {
          set({
            error: "No authenticated user",
            loadingAppointment: false,
          });
          return;
        }

        const now = new Date(); // hora actual exacta, sin truncar

        const { data, error } = await supabase
          .from("appointments")
          .select(`*, pets (*)`)
          .eq("veterinarian_id", user.id)
          .eq("status", "completed")
          .not("date_end", "is", null)
          .lt("date_end", now.toISOString()) // antes del momento actual
          .order("date_end", { ascending: false })
          .limit(5);

        if (error) {
          set({
            errorAppointmen: error.message,
            loadingAppointment: false,
          });
          return;
        }

        set({
          lastAppointments: data,
          loadingAppointment: false,
        });
      },
      insertMedical: async (medicalData) => {
        set({ loadingMedical: true, error: null });

        const user = useAuthStore.getState().user;

        if (!user) {
          set({
            error: "No authenticated user",
            loadingMedical: false,
          });
          return;
        }

        const { data, error } = await supabase
          .from("medical")
          .insert([
            {
              pet_id: medicalData.pet_id,
              veterinarian_id: medicalData.veterinarian_id,
              symptoms: medicalData.symptoms,
              diagnosis: medicalData.diagnosis,
              treatment: medicalData.treatment,
              notes: medicalData.notes,
            },
          ])
          .select()
          .single();

        if (error) {
          set({
            error: error.message,
            loadingMedical: false,
          });
          return;
        }

        set({ loadingMedical: false });

        // opcional refrescar data
        await get().fetchMedicals();
      },
      insertAppointment: async (appointmentData) => {
        set({ loadingAppointment: true, error: null });

        const user = useAuthStore.getState().user;

        if (!user) {
          set({
            error: "No authenticated user",
            loadingAppointment: false,
          });
          return;
        }

        const { data, error } = await supabase
          .from("appointments")
          .insert([
            {
              pet_id: appointmentData.pet_id,
              veterinarian_id: appointmentData.veterinarian_id,
              date: appointmentData.date,
              reason: appointmentData.reason,
              status: appointmentData.status,
            },
          ])
          .select()
          .single();

        if (error) {
          set({
            error: error.message,
            loadingAppointment: false,
          });
          return;
        }

        set({ loadingAppointment: false });

        // opcional refrescar data
        await get().fetchAppointments();
      },
      // ACTUALIZAR PERFIL
      updateMedical: async (medicalId, data) => {
        set({ loadingMedical: true, error: null });

        const user = useAuthStore.getState().user;

        if (!user) {
          set({
            error: "No authenticated user",
            loadingMedical: false,
          });
          return;
        }

        const { error } = await supabase
          .from("medical")
          .update(data)
          .eq("id", medicalId);

        if (error) {
          set({
            error: error.message,
            loadingMedical: false,
          });
          return;
        }

        await get().fetchMedicals();

        set({ loadingMedical: false });
      },
      updateAppointment: async (appointmentId, data) => {
        set({ loadingAppointment: true, error: null });

        const user = useAuthStore.getState().user;

        if (!user) {
          set({
            error: "No authenticated user",
            loadingAppointment: false,
          });
          return;
        }

        const { error } = await supabase
          .from("appointments")
          .update(data)
          .eq("id", appointmentId);

        if (error) {
          set({
            error: error.message,
            loadingAppointment: false,
          });
          return;
        }

        await get().fetchAppointments();

        set({ loadingAppointment: false });
      },
      reset: () =>
        set({
          medicals: null,
          appointments: null,
          loadingMedical: false,
          loadingAppointment: false,
          errorMedicals: null,
          errorAppointmen: null,
          error: null,
        }),
    }),
    {
      name: "medical-profile-storage",
      partialize: (state) => ({
        medicals: state.medicals,
        appointments: state.appointments,
      }),
    }
  )
);
