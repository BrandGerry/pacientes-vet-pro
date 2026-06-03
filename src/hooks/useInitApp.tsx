import { useEffect } from "react";
import { useUserStore } from "../store/useUserStore";
import { usePetsStore } from "../store/usePetsStore";
import { useAppointmentStore } from "../store/useAppointmentStore";

// hooks/useInitApp.ts
export const useInitApp = () => {
  const fetchProfile = useUserStore((s) => s.fetchProfile);
  const allUsers = useUserStore((s) => s.allUsers);
  const fetchPets = usePetsStore((s) => s.fetchPets);
  const fetchOnlyPets = usePetsStore((s) => s.fetchOnlyPets);
  const fetchAppts = useAppointmentStore((s) => s.fetchAppointments);
  const fetchAppointmentsToday = useAppointmentStore(
    (s) => s.fetchAppointmentsToday
  );
  const fetchLastAppointments = useAppointmentStore(
    (s) => s.fetchLastAppointments
  );
  const fetchMedicals = useAppointmentStore((s) => s.fetchMedicals);

  useEffect(() => {
    const init = async () => {
      // await fetchProfile();
      await Promise.all([
        fetchProfile(),
        fetchPets(),
        fetchAppts(),
        fetchMedicals(),
        allUsers(),
        fetchAppointmentsToday(),
        fetchLastAppointments(),
        fetchOnlyPets(),
      ]);
    };
    init();
  }, []);
};
