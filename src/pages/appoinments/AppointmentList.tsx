import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppointmentRow,
  STATUS_CFG,
} from "../../components/appointments/AppointmentRow";
import { isPast, isToday } from "../../helpers/dataOfAppointments";
import { useAppointmentStore } from "../../store/useAppointmentStore";

// ── TYPES ──────────────────────────────────────────────────────────────────
export type AppointmentStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no_show";

// ── Main ───────────────────────────────────────────────────────────────────
type FilterStatus = AppointmentStatus | "all";
type FilterDate = "all" | "today" | "upcoming" | "past";

export const AppointmentList: React.FC = () => {
  const navigate = useNavigate();
  const appointmentsStore = useAppointmentStore((s) => s.appointments);
  const isLoading = useAppointmentStore((s) => s.loadingAppointment);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterDate, setFilterDate] = useState<FilterDate>("all");
  console.log("POPO", appointmentsStore);

  // 👇 Reemplaza con tu store real
  const appointments = appointmentsStore;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return (appointments ?? [])
      .filter((a) => {
        if (filterStatus !== "all" && a.status !== filterStatus) return false;
        if (filterDate === "today" && !isToday(a.date)) return false;
        if (filterDate === "upcoming" && (isPast(a.date) || isToday(a.date)))
          return false;
        if (filterDate === "past" && !isPast(a.date)) return false;
        if (
          q &&
          !a.pets?.name.toLowerCase().includes(q) &&
          !a.pets?.owner_name.toLowerCase().includes(q) &&
          !a.reason.toLowerCase().includes(q)
        )
          return false;
        return true;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [appointments, search, filterStatus, filterDate]);

  // counts for badges
  const counts = useMemo(
    () => ({
      all: appointments?.length,
      scheduled: appointments?.filter((a) => a.status === "scheduled").length,
      completed: appointments?.filter((a) => a.status === "completed").length,
      cancelled: appointments?.filter((a) => a.status === "cancelled").length,
      no_show: appointments?.filter((a) => a.status === "no_show").length,
    }),
    [appointments]
  );

  const todayCount = (appointments ?? []).filter(
    (a) => isToday(a.date) && a.status === "scheduled"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-7">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Citas
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {appointments?.length} cita{appointments?.length !== 1 ? "s" : ""}{" "}
            en total
          </p>
        </div>
        <div className="sm:ml-auto flex gap-2 flex-wrap">
          {todayCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-600 text-white text-xs font-bold shadow-sm shadow-green-200">
              📅 {todayCount} hoy
            </span>
          )}
          <button
            onClick={() => navigate("/appointments/new")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition shadow-sm shadow-green-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nueva cita
          </button>
        </div>
      </div>

      {/* Search + date filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Mascota, propietario, motivo..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-green-200 bg-white text-sm text-gray-700 placeholder-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-3 flex items-center text-gray-300 hover:text-gray-500"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Date filter */}
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "today", "upcoming", "past"] as FilterDate[]).map((fd) => {
            const labels: Record<FilterDate, string> = {
              all: "Todas",
              today: "Hoy",
              upcoming: "Próximas",
              past: "Pasadas",
            };
            return (
              <button
                key={fd}
                onClick={() => setFilterDate(fd)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  filterDate === fd
                    ? "bg-green-600 text-white border-green-600 shadow-sm"
                    : "bg-white text-gray-500 border-gray-200 hover:border-green-300 hover:text-green-700"
                }`}
              >
                {labels[fd]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        {(
          [
            "all",
            "scheduled",
            "completed",
            "cancelled",
            "no_show",
          ] as FilterStatus[]
        ).map((s) => {
          const labels: Record<FilterStatus, string> = {
            all: "Todas",
            scheduled: "Programadas",
            completed: "Completadas",
            cancelled: "Canceladas",
            no_show: "No asistió",
          };
          const isActive = filterStatus === s;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isActive
                  ? "bg-green-600 text-white border-green-600 shadow-sm"
                  : "bg-white text-gray-500 border-gray-200 hover:border-green-200 hover:text-green-700"
              }`}
            >
              {s !== "all" && (
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive
                      ? "bg-white"
                      : STATUS_CFG[s as AppointmentStatus].dot
                  }`}
                />
              )}
              {labels[s]}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {s === "all" ? counts.all : counts[s as AppointmentStatus]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results note */}
      {(search || filterStatus !== "all" || filterDate !== "all") &&
        filtered.length > 0 && (
          <p className="text-xs text-gray-400 mb-4">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </p>
        )}

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-2xl border border-gray-100 p-4 flex gap-4"
            >
              <div className="w-14 h-16 bg-green-100 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 bg-gray-100 rounded w-1/3" />
                <div className="h-2 bg-gray-50 rounded w-1/2" />
                <div className="h-2 bg-gray-50 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mb-4">
            📅
          </div>
          <p className="text-gray-500 font-medium">
            Sin citas{search ? " para esa búsqueda" : " en esta vista"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Intenta cambiar los filtros
          </p>
          {(search || filterStatus !== "all" || filterDate !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setFilterStatus("all");
                setFilterDate("all");
              }}
              className="mt-4 text-sm text-green-600 hover:underline font-medium"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* List */}
      {!isLoading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((a) => (
            <AppointmentRow
              key={a.id}
              appt={a}
              onClick={() => navigate(`/appointments/${a.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
