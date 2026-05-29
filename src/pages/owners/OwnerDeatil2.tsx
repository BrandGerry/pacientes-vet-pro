import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ── Types ──────────────────────────────────────────────────────────────────
interface Vaccine {
  name: string;
  date: string;
  nextDue?: string;
}

interface Visit {
  date: string;
  reason: string;
  vet?: string;
  notes?: string;
}

interface Pet {
  id: string | number;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number; // kg
  color?: string;
  sex?: "macho" | "hembra";
  sterilized?: boolean;
  vaccines?: Vaccine[];
  lastVisit?: Visit;
  avatarUrl?: string;
}

interface Owner {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  notes?: string;
  memberSince?: string;
  pets: Pet[];
  avatarUrl?: string;
}

// ── Mock data (reemplaza con tu store) ─────────────────────────────────────
const MOCK_OWNERS: Owner[] = [
  {
    id: "1",
    name: "Ana García",
    email: "ana.garcia@email.com",
    phone: "+52 55 1234 5678",
    address: "Calle Roble 45, Col. Del Valle",
    city: "Ciudad de México",
    memberSince: "2022-03-15",
    notes:
      "Prefiere citas por la mañana. Alérgica a los gatos pero tiene uno 🙂",
    pets: [
      {
        id: "p1",
        name: "Luna",
        species: "dog",
        breed: "Golden Retriever",
        age: 3,
        weight: 28,
        color: "Dorado",
        sex: "hembra",
        sterilized: true,
        vaccines: [
          { name: "Rabia", date: "2024-01-10", nextDue: "2025-01-10" },
          { name: "Moquillo", date: "2024-01-10", nextDue: "2025-01-10" },
          { name: "Parvovirus", date: "2024-01-10", nextDue: "2025-01-10" },
        ],
        lastVisit: {
          date: "2024-11-20",
          reason: "Revisión anual",
          vet: "Dr. Ramírez",
          notes: "Todo en orden, peso ideal.",
        },
      },
      {
        id: "p2",
        name: "Milo",
        species: "cat",
        breed: "Siamés",
        age: 5,
        weight: 4.2,
        color: "Café y crema",
        sex: "macho",
        sterilized: true,
        vaccines: [
          { name: "Triple felina", date: "2024-03-05", nextDue: "2025-03-05" },
        ],
        lastVisit: {
          date: "2024-09-14",
          reason: "Infección urinaria",
          vet: "Dra. López",
          notes: "Antibiótico por 7 días. Dieta húmeda recomendada.",
        },
      },
    ],
  },
  {
    id: "2",
    name: "Carlos Mendoza",
    email: "carlos.m@email.com",
    phone: "+52 55 9876 5432",
    address: "Av. Insurgentes Sur 1200",
    city: "Ciudad de México",
    memberSince: "2023-07-01",
    pets: [
      {
        id: "p3",
        name: "Rocky",
        species: "dog",
        breed: "Labrador",
        age: 2,
        weight: 32,
        color: "Negro",
        sex: "macho",
        sterilized: false,
        vaccines: [
          { name: "Rabia", date: "2024-06-20", nextDue: "2025-06-20" },
        ],
        lastVisit: {
          date: "2024-06-20",
          reason: "Vacunación",
          vet: "Dr. Ramírez",
        },
      },
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────
const speciesEmoji: Record<string, string> = {
  dog: "🐶",
  cat: "🐱",
  bird: "🐦",
  rabbit: "🐰",
  hamster: "🐹",
  fish: "🐠",
  reptile: "🦎",
};
const getEmoji = (s: string) => speciesEmoji[s.toLowerCase()] ?? "🐾";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const isOverdue = (nextDue?: string) => {
  if (!nextDue) return false;
  return new Date(nextDue) < new Date();
};

// ── InfoRow ────────────────────────────────────────────────────────────────
const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 shrink-0 w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
      {icon}
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium leading-none mb-0.5">
        {label}
      </p>
      <p className="text-sm text-gray-700">{value}</p>
    </div>
  </div>
);

// ── VaccineRow ─────────────────────────────────────────────────────────────
const VaccineRow: React.FC<{ vaccine: Vaccine }> = ({ vaccine }) => {
  const overdue = isOverdue(vaccine.nextDue);
  console.log("ajjajaja", overdue);
  return (
    <div className="flex items-center justify-between py-2 border-b border-green-50 last:border-0">
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            overdue ? "bg-red-400" : "bg-green-400"
          }`}
        />
        <span className="text-sm text-gray-700">{vaccine.name}</span>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-400">{formatDate(vaccine.date)}</p>
        {vaccine.nextDue && (
          <p
            className={`text-xs font-medium ${
              overdue ? "text-red-500" : "text-green-600"
            }`}
          >
            {overdue ? "Vencida" : `Próx. ${formatDate(vaccine.nextDue)}`}
          </p>
        )}
      </div>
    </div>
  );
};

// ── PetCard ────────────────────────────────────────────────────────────────
const PetCard: React.FC<{ pet: Pet; index: number }> = ({ pet, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Card Header */}
      <div className="bg-linear-to-r from-green-50 to-white px-5 py-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-green-200 flex items-center justify-center text-2xl shrink-0 shadow-inner">
          {getEmoji(pet.species)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 text-lg leading-tight">
            {pet.name}
          </h3>
          <p className="text-sm text-green-700 font-medium">
            {pet.breed ?? pet.species}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {pet.sex && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 font-medium capitalize">
                {pet.sex === "macho" ? "♂ Macho" : "♀ Hembra"}
              </span>
            )}
            {pet.sterilized !== undefined && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                  pet.sterilized
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-gray-100 text-gray-500 border-gray-200"
                }`}
              >
                {pet.sterilized ? "Esterilizado/a" : "No esterilizado/a"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 divide-x divide-green-50 border-t border-green-50">
        {[
          {
            label: "Edad",
            value: pet.age ? `${pet.age} año${pet.age !== 1 ? "s" : ""}` : "—",
          },
          { label: "Peso", value: pet.weight ? `${pet.weight} kg` : "—" },
          { label: "Color", value: pet.color ?? "—" },
        ].map((s) => (
          <div key={s.label} className="py-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
              {s.label}
            </p>
            <p className="text-sm font-semibold text-gray-700 mt-0.5">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Expandable section */}
      <div className="border-t border-green-50">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-gray-500 hover:text-green-700 hover:bg-green-50 transition-colors"
        >
          <span>Ver historial y vacunas</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {expanded && (
          <div className="px-5 pb-5 space-y-5">
            {/* Vaccines */}
            {pet.vaccines && pet.vaccines.length > 0 && (
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-2">
                  Vacunas
                </p>
                <div className="rounded-xl border border-green-100 px-3 bg-green-50/40">
                  {pet.vaccines.map((v) => (
                    <VaccineRow key={v.name} vaccine={v} />
                  ))}
                </div>
              </div>
            )}

            {/* Last visit */}
            {pet.lastVisit && (
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-2">
                  Última visita
                </p>
                <div className="rounded-xl border border-green-100 p-3 bg-green-50/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      {pet.lastVisit.reason}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(pet.lastVisit.date)}
                    </span>
                  </div>
                  {pet.lastVisit.vet && (
                    <p className="text-xs text-green-700">
                      {pet.lastVisit.vet}
                    </p>
                  )}
                  {pet.lastVisit.notes && (
                    <p className="text-xs text-gray-500 italic border-t border-green-100 pt-1.5">
                      {pet.lastVisit.notes}
                    </p>
                  )}
                </div>
              </div>
            )}

            {!pet.vaccines?.length && !pet.lastVisit && (
              <p className="text-sm text-gray-400 italic text-center py-2">
                Sin registros aún
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
export const OwnerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 👇 Reemplaza con tu store real
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula carga — reemplaza con fetchOwnerById(id) de tu store
    const found = MOCK_OWNERS.find((o) => String(o.id) === id);
    setTimeout(() => {
      setOwner(found ?? null);
      setLoading(false);
    }, 400);
  }, [id]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
        <div className="animate-pulse max-w-4xl mx-auto space-y-6">
          <div className="h-8 w-32 bg-green-100 rounded-lg" />
          <div className="bg-white rounded-2xl p-6 h-40 border border-green-100" />
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 h-64 border border-green-100" />
            <div className="bg-white rounded-2xl p-6 h-64 border border-green-100" />
          </div>
        </div>
      </div>
    );
  }

  // ── Not found ────────────────────────────────────────────────────────────
  if (!owner) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">
          🐾
        </div>
        <p className="text-gray-600 font-medium">Propietario no encontrado</p>
        <button
          onClick={() => navigate("/owners")}
          className="text-sm text-green-700 hover:underline"
        >
          ← Volver a propietarios
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      <div className="w-full mx-auto space-y-6">
        {/* ── Back button ───────────────────────────────────────────── */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-green-700 transition-colors group"
        >
          <svg
            className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Propietarios
        </button>

        {/* ── Owner profile card ────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">
          {/* Banner */}
          <div className="h-3 bg-linear-to-r from-green-200 via-green-300 to-green-200" />

          <div className="px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              {/* Avatar */}
              <div className="shrink-0 w-20 h-20 rounded-2xl bg-green-200 flex items-center justify-center overflow-hidden shadow-sm border-2 border-white ring-2 ring-green-100">
                {owner.avatarUrl ? (
                  <img
                    src={owner.avatarUrl}
                    alt={owner.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-green-800 font-bold text-2xl">
                    {getInitials(owner.name)}
                  </span>
                )}
              </div>

              {/* Name & meta */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight leading-tight">
                  {owner.name}
                </h1>
                <p className="text-sm text-gray-400 mt-0.5">{owner.email}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 font-medium">
                    🐾 {owner.pets.length} mascota
                    {owner.pets.length !== 1 ? "s" : ""}
                  </span>
                  {owner.memberSince && (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                      📅 Cliente desde {formatDate(owner.memberSince)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact info grid */}
            <div className="grid sm:grid-cols-2 gap-4 mt-6 pt-5 border-t border-green-50">
              {owner.phone && (
                <InfoRow
                  label="Teléfono"
                  value={owner.phone}
                  icon={
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  }
                />
              )}
              <InfoRow
                label="Correo electrónico"
                value={owner.email}
                icon={
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                }
              />
              {owner.address && (
                <InfoRow
                  label="Dirección"
                  value={`${owner.address}${
                    owner.city ? `, ${owner.city}` : ""
                  }`}
                  icon={
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  }
                />
              )}
            </div>

            {/* Notes */}
            {owner.notes && (
              <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-100">
                <p className="text-[10px] uppercase tracking-wider text-green-600 font-medium mb-1">
                  Notas
                </p>
                <p className="text-sm text-gray-600 italic">{owner.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Pets section ──────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-700 tracking-tight">
              Mascotas
              <span className="ml-2 text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full border border-green-200">
                {owner.pets.length}
              </span>
            </h2>
          </div>

          {owner.pets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 bg-white rounded-2xl border border-green-100 text-center">
              <span className="text-4xl mb-3">🐾</span>
              <p className="text-gray-500 font-medium">
                Sin mascotas registradas
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Este propietario aún no tiene mascotas
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {owner.pets.map((pet, i) => (
                <PetCard key={pet.id} pet={pet} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
