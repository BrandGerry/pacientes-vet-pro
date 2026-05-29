import React, { useState } from "react";
import { useUserStore } from "../../store/useUserStore";
import { useAppointmentStore } from "../../store/useAppointmentStore";
import { usePetsStore } from "../../store/usePetsStore";
import { Spinner } from "../../components/Spinner";
import {
  countOwnersThisWeek,
  funcCountAllPets,
  funcCountAppointmentsToday,
  funcCountAppointPending,
  funcLastPatientOfMonth,
} from "../../helpers/functionDashboard";
import {
  buildStats,
  dateStr,
  getPetEmoji,
} from "../../helpers/dataOfDashboard";
import { Link } from "react-router-dom";

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  completed: {
    label: "Completada",
    classes: "bg-green-100 text-green-700 border border-green-200",
  },
  in_progress: {
    label: "En curso",
    classes: "bg-blue-100 text-blue-700 border border-blue-200",
  },
  scheduled: {
    label: "Pendiente",
    classes: "bg-amber-100 text-amber-700 border border-amber-200",
  },
};

const Dashboard: React.FC = () => {
  const { userProfile, activeUsersCount } = useUserStore();
  const {
    appointments,
    loadingAppointment,
    loadingMedical,
    appointmentsToday,
    lastAppointments,
  } = useAppointmentStore();
  const { pets, loading } = usePetsStore();
  const [activeTab, setActiveTab] = useState<"citas" | "pacientes">("citas");

  const STATS = buildStats({
    totalPatients: funcCountAllPets(pets ?? []),
    patientsThisMonth: funcLastPatientOfMonth(pets ?? []),
    appointmentsToday: funcCountAppointmentsToday(appointments ?? []),
    pendingAppointments: funcCountAppointPending(appointments ?? []),
    vets: pets?.length,
    owners: activeUsersCount,
    ownersThisWeek: countOwnersThisWeek(pets ?? []),
  });

  console.log("MOSHULO", appointmentsToday?.length);
  return (
    <>
      {loadingAppointment || loadingMedical || loading ? (
        <Spinner />
      ) : (
        <div className="min-h-screen bg-green-50 font-sans">
          <main className="ml-3 md:ml-10 p-6 md:p-8">
            {/* HEADER TITLE */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-green-900">
                  {/* CAMBIAR ESTO POR EL NOMBRE */}
                  {userProfile && userProfile.username
                    ? `Buen día, ${userProfile.username} 👋`
                    : "Buen día, Dr/Dra 👋"}
                </h1>
                <p className="text-sm text-gray-500 mt-1 capitalize">
                  {dateStr}
                </p>
              </div>
              <Link
                to="/appointments/new"
                className="self-start md:self-auto flex items-center gap-2 bg-green-200 hover:bg-green-300 text-green-900 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
              >
                <span>+</span> Nueva cita
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-5 border border-green-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{stat.icon}</span>
                    <span className="text-xs text-gray-400 bg-green-50 px-2 py-0.5 rounded-full">
                      {stat.trend}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-green-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-green-100 p-1 rounded-xl w-fit mb-6">
              {(["citas", "pacientes"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-colors ${
                    activeTab === tab
                      ? "bg-white text-green-900 shadow-sm"
                      : "text-green-700 hover:text-green-900"
                  }`}
                >
                  {tab === "citas" ? "📅 Citas de hoy" : "🐾 Últimos pacientes"}
                </button>
              ))}
            </div>

            {/* ── Citas Table ── */}
            {activeTab === "citas" && (
              <div className="bg-white rounded-2xl border border-green-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-green-50 flex items-center justify-between">
                  <h2 className="font-semibold text-green-900">
                    Agenda del día
                  </h2>
                  <span className="text-xs text-gray-400">
                    {funcCountAppointmentsToday(appointments ?? [])} citas
                  </span>
                </div>
                {/* ── TODAY? ── */}
                {appointmentsToday?.length !== 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-green-50 text-left">
                          <th className="px-3 md:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Hora
                          </th>
                          <th className="px-3 md:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Paciente
                          </th>
                          <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                            Dueño
                          </th>
                          <th className="px-3 md:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Estado
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-green-50">
                        {appointmentsToday?.map((appt) => {
                          const statusConfig =
                            STATUS_CONFIG[appt.status] ||
                            STATUS_CONFIG.scheduled;
                          return (
                            <tr
                              key={appt.id}
                              className="hover:bg-green-50/50 transition-colors cursor-pointer"
                            >
                              <td className="px-3 md:px-6 py-4 font-mono font-bold text-green-800">
                                {new Date(appt.date).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </td>
                              <td className="px-3 md:px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">
                                    {getPetEmoji(appt.pets?.specie)}
                                  </span>
                                  <span className="font-semibold text-gray-800">
                                    {appt.pets?.name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                                {appt.pets?.owner_name}
                              </td>
                              <td className="px-3 md:px-6 py-4">
                                <span
                                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusConfig.classes}`}
                                >
                                  {statusConfig.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-green-50 p-3">
                    <p className="text-md text-center">
                      No hay citas disponibles hoy.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── Pacientes Cards ── */}
            {activeTab === "pacientes" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {lastAppointments?.map((patient) => (
                  <div
                    key={patient.id}
                    className="bg-white rounded-2xl border border-green-100 p-5 hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center text-3xl shrink-0 group-hover:bg-green-200 transition-colors">
                        {/* {patient.avatar} */}{" "}
                        {getPetEmoji(patient.pets?.specie)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-green-900 text-base">
                            {patient.pets?.name}
                          </h3>
                          <span className="text-xs text-gray-400">
                            {new Date(patient.date_end).toLocaleDateString(
                              "es-MX",
                              {
                                day: "numeric",
                                month: "long",
                              }
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {patient.pets?.breed}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <span>👤</span> {patient.pets?.owner_name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: "🐾", label: "Nuevo paciente", link: "/pets/new" },
                { icon: "👤", label: "Dueños", link: "/owners" },
                { icon: "📋", label: "Ver historial", link: "/records/list" },
                { icon: "📊", label: "Reportes", link: "/reports" },
              ].map((action) => (
                <Link
                  key={action.label}
                  to={action.link}
                  className="flex flex-col items-center gap-2 p-4 bg-white border border-green-100 rounded-2xl hover:bg-green-200 hover:border-green-200 transition-colors text-sm font-medium text-green-800"
                >
                  <span className="text-2xl">{action.icon}</span>
                  {action.label}
                </Link>
              ))}
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default Dashboard;
