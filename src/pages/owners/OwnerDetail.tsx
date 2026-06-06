import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { formatDate, getInitials } from "../../helpers/dataOfOwner";
import { PetCard } from "../../components/owners/PetCard";
import { InfoRow } from "../../components/owners/InfoRow";
import { OwnerWithPets } from "../../store/usePetsStore";

// ── Mock data (reemplaza con tu store) ─────────────────────────────────────
const MOCK_OWNERS = [
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

// ── Main Component ─────────────────────────────────────────────────────────
export const OwnerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [owner, setOwner] = useState<OwnerWithPets | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchOwner = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("owners")
        .select(
          `
        *,
        pets (
          *,
          vaccines (*),
          medical (*)
        )
      `
        )
        .eq("id", id)
        .single();

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setOwner(data);
      setLoading(false);
    };

    fetchOwner();
  }, [id]);

  // LOADING
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

  //PROPIETARIO NO ENCONTRADO
  if (!owner || error) {
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
                {owner.avatar_url ? (
                  <img
                    src={owner.avatar_url}
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
                  {owner.created_at && (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                      📅 Cliente desde {formatDate(owner.created_at)}
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
                value={owner.email || ""}
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
                  value={`${owner.address}`}
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
            <div className="grid sm:grid-cols-2 gap-4 items-start">
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
