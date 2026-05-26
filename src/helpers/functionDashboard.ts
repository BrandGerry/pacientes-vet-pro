import { Appointments } from "../store/useAppointmentStore";
import { OwnerWithPets } from "../store/usePetsStore";

export const funcLastPatientOfMonth = (data: OwnerWithPets[]): number => {
  console.log("DATA", data);
  const now = new Date(); // 2026-05-07
  const currentMonth = now.getMonth(); // 4 (Mayo, 0-indexed)
  const currentYear = now.getFullYear(); // 2026

  const count = data.reduce((total, patient) => {
    const petsThisMonth = patient.pets.filter((pet) => {
      const petDate = new Date(pet.created_at);
      return (
        petDate.getMonth() === currentMonth &&
        petDate.getFullYear() === currentYear
      );
    });

    return total + petsThisMonth.length;
  }, 0);

  return count;
};

export const funcCountAllPets = (data: OwnerWithPets[]): number => {
  return data.reduce((total, patient) => total + patient.pets.length, 0);
};

export const funcCountAppointmentsToday = (data: Appointments[]): number => {
  const today = new Date();

  return data.reduce((total, appointment) => {
    const appointmentDate = new Date(appointment.date);
    const isToday =
      appointmentDate.getDate() === today.getDate() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getFullYear() === today.getFullYear();

    return isToday ? total + 1 : total;
  }, 0);
};

export const funcCountAppointPending = (data: Appointments[]): number => {
  return data.reduce((total, appointment) => {
    const appointmentstatus = "scheduled";
    const isPending = appointment.status === appointmentstatus;

    return isPending ? total + 1 : total;
  }, 0);
};

export const countOwnersThisWeek = (data: OwnerWithPets[]) => {
  const now = new Date();

  // Obtener inicio de semana (lunes)
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay(); // 0 = domingo, 1 = lunes

  // Ajuste para que la semana empiece en lunes
  const diff = day === 0 ? -6 : 1 - day;

  startOfWeek.setDate(startOfWeek.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);

  // Fin de semana
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const ownersThisWeek = data.filter((owner) => {
    const createdAt = new Date(owner.created_at);

    return createdAt >= startOfWeek && createdAt < endOfWeek;
  });

  return ownersThisWeek.length;
};
