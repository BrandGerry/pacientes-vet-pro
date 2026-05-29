import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { OwnerCard } from "../../components/owners/OwnerCard";
import { OwnerWithPets, usePetsStore } from "../../store/usePetsStore";

// ── Main Component ─────────────────────────────────────────────────────────
export const OwnersList: React.FC = () => {
  const navigate = useNavigate();
  const { pets, loading } = usePetsStore();
  console.log("PETS", pets);

  const [owners, setOwners] = useState(pets);
  const [search, setSearch] = useState("");

  // Filtrado
  const filtered = useMemo(() => {
    const srch = search.toLowerCase().trim();

    if (!srch) return owners ?? [];

    return (
      owners?.filter(
        (o) =>
          o.name.toLowerCase().includes(srch) ||
          o.email?.toLowerCase().includes(srch) ||
          o.phone?.includes(srch) ||
          o.pets.some(
            (p) =>
              p.name.toLowerCase().includes(srch) ||
              p.specie.toLowerCase().includes(srch) ||
              p.breed?.toLowerCase().includes(srch)
          )
      ) ?? []
    );
  }, [owners, search]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Propietarios
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {owners?.length} propietario{owners?.length !== 1 ? "s" : ""}{" "}
          registrado
          {owners?.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── Search Bar ──────────────────────────────────────────────── */}
      <div className="relative mb-6 max-w-lg">
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
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por propietario, mascota, raza..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-green-200 bg-white text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute inset-y-0 right-3 flex items-center text-gray-300 hover:text-gray-500 transition"
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

      {/* ── Results info ───────────────────────────────────────────── */}
      {search && (
        <p className="text-xs text-gray-400 mb-4">
          {filtered?.length === 0
            ? "Sin resultados para"
            : `${filtered?.length} resultado${
                filtered?.length !== 1 ? "s" : ""
              } para`}{" "}
          <span className="font-medium text-green-700">"{search}"</span>
        </p>
      )}

      {/* ── Loading ─────────────────────────────────────────────────── */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-2xl border border-green-100 p-5 h-40"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-green-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-green-100 rounded w-3/4" />
                  <div className="h-2 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded mb-2" />
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-green-50 rounded-full" />
                <div className="h-5 w-16 bg-green-50 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Empty state ─────────────────────────────────────────────── */}
      {!loading && filtered?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <span className="text-3xl">🐾</span>
          </div>
          <p className="text-gray-500 font-medium">
            {search
              ? "No se encontraron propietarios"
              : "No hay propietarios aún"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {search
              ? "Intenta con otro término de búsqueda"
              : "Los propietarios registrados aparecerán aquí"}
          </p>
        </div>
      )}

      {/* ── Grid de tarjetas ────────────────────────────────────────── */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered?.map((owner) => (
            <OwnerCard
              key={owner.id}
              owner={owner}
              onClick={() => navigate(`/owners/${owner.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
