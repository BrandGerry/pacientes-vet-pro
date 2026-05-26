const now = new Date();

// Defines la forma del dato
export interface StatsData {
  totalPatients: number;
  patientsThisMonth: number;
  appointmentsToday: number;
  pendingAppointments: number;
  vets: number | undefined;
  owners: number;
  ownersThisWeek: number;
}

export function buildStats(data: StatsData) {
  return [
    {
      label: "Pacientes totales",
      value: data.totalPatients,
      icon: "🐾",
      trend: `+${data.patientsThisMonth} este mes`,
    },
    {
      label: "Citas hoy",
      value: data.appointmentsToday,
      icon: "📅",
      trend: `${data.pendingAppointments} pendientes`,
    },
    {
      label: "Veterinarios",
      value: data.vets,
      icon: "👨‍⚕️",
      trend: "",
    },
    {
      label: "Dueños registrados",
      value: data.owners,
      icon: "👤",
      trend: `+${data.ownersThisWeek} esta semana`,
    },
  ];
}

export const dateStr = now.toLocaleDateString("es-MX", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export const getPetEmoji = (specie: string) => {
  const normalizedSpecie = specie?.toLowerCase().trim();

  switch (normalizedSpecie) {
    case "perro":
    case "dog":
      return "🐕";

    case "gato":
    case "cat":
      return "🐈";

    case "hamster":
    case "hámster":
    case "raton":
    case "ratón":
      return "🐹";

    case "conejo":
    case "rabbit":
      return "🐰";

    case "ave":
    case "pajaro":
    case "pájaro":
    case "bird":
      return "🦆";

    case "reptil":
    case "serpiente":
    case "lagarto":
    case "tortuga":
      return "🐊";

    case "pez":
    case "fish":
      return "🐟";

    case "caballo":
    case "horse":
      return "🐎";

    case "cerdo":
    case "pig":
      return "🐖";

    case "vaca":
    case "cow":
      return "🐄";

    case "mono":
    case "monkey":
      return "🐒";

    default:
      return "🐾";
  }
};
