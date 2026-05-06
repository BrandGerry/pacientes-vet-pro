import React, { useState } from "react";
import { useUserStore } from "../../store/useUserStore";

//DATA MOCK
const STATS = [
  { label: "Pacientes totales", value: 128, icon: "🐾", trend: "+4 este mes" },
  { label: "Citas hoy", value: 9, icon: "📅", trend: "3 pendientes" },
  { label: "Veterinarios", value: 5, icon: "👨‍⚕️", trend: "Todos activos" },
  {
    label: "Dueños registrados",
    value: 97,
    icon: "👤",
    trend: "+2 esta semana",
  },
];

const APPOINTMENTS_TODAY = [
  {
    id: 1,
    time: "09:00",
    pet: "Luna",
    species: "🐕",
    owner: "María López",
    vet: "Dr. García",
    status: "completada",
  },
  {
    id: 2,
    time: "10:30",
    pet: "Mochi",
    species: "🐈",
    owner: "Carlos Ruiz",
    vet: "Dra. Martínez",
    status: "en_curso",
  },
  {
    id: 3,
    time: "12:00",
    pet: "Rocky",
    species: "🐕",
    owner: "Ana Torres",
    vet: "Dr. García",
    status: "pendiente",
  },
  {
    id: 4,
    time: "13:30",
    pet: "Nube",
    species: "🐇",
    owner: "Luis Herrera",
    vet: "Dra. Soto",
    status: "pendiente",
  },
  {
    id: 5,
    time: "15:00",
    pet: "Simba",
    species: "🐈",
    owner: "Paula Mendez",
    vet: "Dra. Martínez",
    status: "pendiente",
  },
];

const RECENT_PATIENTS = [
  {
    id: 1,
    name: "Luna",
    species: "Perro",
    breed: "Golden Retriever",
    owner: "María López",
    lastVisit: "Hoy",
    avatar: "🐕",
  },
  {
    id: 2,
    name: "Mochi",
    species: "Gato",
    breed: "Siamés",
    owner: "Carlos Ruiz",
    lastVisit: "Hoy",
    avatar: "🐈",
  },
  {
    id: 3,
    name: "Pipa",
    species: "Perro",
    breed: "Beagle",
    owner: "Sofía Castro",
    lastVisit: "Ayer",
    avatar: "🐕",
  },
  {
    id: 4,
    name: "Kiwi",
    species: "Ave",
    breed: "Periquito",
    owner: "Jorge Díaz",
    lastVisit: "02 Jun",
    avatar: "🦜",
  },
  {
    id: 5,
    name: "Rocky",
    species: "Perro",
    breed: "Pastor Alemán",
    owner: "Ana Torres",
    lastVisit: "Hoy",
    avatar: "🐕",
  },
];

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  completada: {
    label: "Completada",
    classes: "bg-green-100 text-green-700 border border-green-200",
  },
  en_curso: {
    label: "En curso",
    classes: "bg-blue-100  text-blue-700  border border-blue-200",
  },
  pendiente: {
    label: "Pendiente",
    classes: "bg-amber-100 text-amber-700 border border-amber-200",
  },
};

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"citas" | "pacientes">("citas");
  const { userProfile, fetchProfile, loading } = useUserStore();
  console.log("KKKKKK", userProfile);

  const now = new Date();
  const dateStr = now.toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-green-50 font-sans">
      <main className="ml-3 md:ml-10 p-6 md:p-8">
        {/* HEADER TITLE */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-green-900">
              {/* CAMBIAR ESTO POR EL NOMBRE */}
              Buen día, Dra. Soto 👋
            </h1>
            <p className="text-sm text-gray-500 mt-1 capitalize">{dateStr}</p>
          </div>
          <button className="self-start md:self-auto flex items-center gap-2 bg-green-200 hover:bg-green-300 text-green-900 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors">
            <span>+</span> Nueva cita
          </button>
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
              <p className="text-3xl font-bold text-green-900">{stat.value}</p>
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
              <h2 className="font-semibold text-green-900">Agenda del día</h2>
              <span className="text-xs text-gray-400">
                {APPOINTMENTS_TODAY.length} citas
              </span>
            </div>
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
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                      Veterinario
                    </th>
                    <th className="px-3 md:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-50">
                  {APPOINTMENTS_TODAY.map((appt) => {
                    const status = STATUS_CONFIG[appt.status];
                    return (
                      <tr
                        key={appt.id}
                        className="hover:bg-green-50/50 transition-colors cursor-pointer"
                      >
                        <td className="px-3 md:px-6 py-4 font-mono font-bold text-green-800">
                          {appt.time}
                        </td>
                        <td className="px-3 md:px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{appt.species}</span>
                            <span className="font-semibold text-gray-800">
                              {appt.pet}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                          {appt.owner}
                        </td>
                        <td className="px-6 py-4 text-gray-500 hidden lg:table-cell">
                          {appt.vet}
                        </td>
                        <td className="px-3 md:px-6 py-4">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.classes}`}
                          >
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Pacientes Cards ── */}
        {activeTab === "pacientes" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {RECENT_PATIENTS.map((patient) => (
              <div
                key={patient.id}
                className="bg-white rounded-2xl border border-green-100 p-5 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center text-3xl shrink-0 group-hover:bg-green-200 transition-colors">
                    {patient.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-green-900 text-base">
                        {patient.name}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {patient.lastVisit}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {patient.breed}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <span>👤</span> {patient.owner}
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
            { icon: "🐾", label: "Nuevo paciente" },
            { icon: "👤", label: "Nuevo dueño" },
            { icon: "📋", label: "Ver historial" },
            { icon: "📊", label: "Reportes" },
          ].map((action) => (
            <button
              key={action.label}
              className="flex flex-col items-center gap-2 p-4 bg-white border border-green-100 rounded-2xl hover:bg-green-200 hover:border-green-200 transition-colors text-sm font-medium text-green-800"
            >
              <span className="text-2xl">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
