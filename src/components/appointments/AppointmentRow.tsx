import {
  getTimeFromDate,
  isPast,
  isToday,
} from "../../helpers/dataOfAppointments";
import { AppointmentStatus } from "../../pages/appoinments/AppointmentList";
import { Appointments } from "../../store/useAppointmentStore";

export const STATUS_CFG: Record<
  AppointmentStatus,
  { label: string; dot: string; badge: string }
> = {
  scheduled: {
    label: "Programada",
    dot: "bg-blue-400",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  completed: {
    label: "Completada",
    dot: "bg-green-400",
    badge: "bg-green-50 text-green-700 border-green-200",
  },
  cancelled: {
    label: "Cancelada",
    dot: "bg-gray-300",
    badge: "bg-gray-100 text-gray-500 border-gray-200",
  },
  no_show: {
    label: "No asistió",
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-600 border-red-200",
  },
};

const SPECIES_EMOJI: Record<string, string> = {
  perro: "🐶",
  gato: "🐱",
  pajaro: "🐦",
  conejo: "🐰",
  hamster: "🐹",
  pez: "🐠",
  reptil: "🦎",
};
const getEmoji = (s: string) => SPECIES_EMOJI[s] ?? "🐾";

export const AppointmentRow: React.FC<{
  appt: Appointments;
  onClick: () => void;
}> = ({ appt, onClick }) => {
  const cfg = STATUS_CFG[appt.status as AppointmentStatus];
  const past = isPast(appt.date) && appt.status === "scheduled";
  console.log("appt", appt);
  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-150 p-4 flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-green-300"
    >
      {/* Date block */}
      <div
        className={`shrink-0 w-14 text-center rounded-xl py-2 border ${
          isToday(appt.date)
            ? "bg-green-600 border-green-600"
            : "bg-green-50 border-green-100"
        }`}
      >
        <p
          className={`text-[10px] uppercase font-bold tracking-wider ${
            isToday(appt.date) ? "text-green-100" : "text-green-500"
          }`}
        >
          {new Date(appt.date).toLocaleDateString("es-MX", {
            month: "short",
          })}
        </p>
        <p
          className={`text-xl font-extrabold leading-none ${
            isToday(appt.date) ? "text-white" : "text-green-700"
          }`}
        >
          {new Date(appt.date).getDate()}
        </p>
        <p
          className={`text-[10px] font-semibold mt-0.5 ${
            isToday(appt.date) ? "text-green-100" : "text-gray-400"
          }`}
        >
          {getTimeFromDate(appt.date)}
        </p>
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-base">
            {appt && appt.pets && getEmoji(appt.pets.specie)}
          </span>
          <p className="font-bold text-gray-800 truncate group-hover:text-green-700 transition-colors">
            {appt && appt.pets && appt.pets.name}
          </p>
          {past && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 font-medium shrink-0">
              Pendiente
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 truncate">{appt.reason}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-[11px] text-gray-400 flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {appt && appt.pets && appt.pets.owner_name}
          </span>
        </div>
      </div>

      {/* Status + arrow */}
      <div className="shrink-0 flex flex-col items-end gap-2">
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${cfg.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
        <svg
          className="w-4 h-4 text-gray-300 group-hover:text-green-400 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
};
