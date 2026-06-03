import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PetCard } from "../../components/pets/PetCard";
import { usePetsStore } from "../../store/usePetsStore";
import { SPECIES_CONFIG } from "../../helpers/dataOfPets";

// ── Mock data ──────────────────────────────────────────────────────────────
const MOCK_PETS = [
  {
    id: "p1",
    name: "Luna",
    species: "dog",
    breed: "Golden Retriever",
    age: 3,
    weight: 28,
    sex: "hembra",
    sterilized: true,
    ownerName: "Ana García",
    ownerId: "1",
    lastVisit: "2024-11-20",
    avatarColor: "bg-amber-200",
  },
  {
    id: "p2",
    name: "Milo",
    species: "cat",
    breed: "Siamés",
    age: 5,
    weight: 4.2,
    sex: "macho",
    sterilized: true,
    ownerName: "Ana García",
    ownerId: "1",
    lastVisit: "2024-09-14",
    avatarColor: "bg-stone-200",
  },
  {
    id: "p3",
    name: "Rocky",
    species: "dog",
    breed: "Labrador",
    age: 2,
    weight: 32,
    sex: "macho",
    sterilized: false,
    ownerName: "Carlos Mendoza",
    ownerId: "2",
    lastVisit: "2024-06-20",
    avatarColor: "bg-zinc-300",
  },
  {
    id: "p4",
    name: "Piolín",
    species: "bird",
    breed: "Canario",
    age: 1,
    sex: "macho",
    sterilized: false,
    ownerName: "Sofía Torres",
    ownerId: "3",
    lastVisit: "2024-08-05",
    avatarColor: "bg-yellow-200",
  },
  {
    id: "p5",
    name: "Canela",
    species: "rabbit",
    breed: "Enano holandés",
    age: 2,
    weight: 1.8,
    sex: "hembra",
    sterilized: true,
    ownerName: "Sofía Torres",
    ownerId: "3",
    lastVisit: "2024-10-01",
    avatarColor: "bg-orange-200",
  },
  {
    id: "p6",
    name: "Sombra",
    species: "cat",
    breed: "Persa",
    age: 7,
    weight: 5.1,
    sex: "hembra",
    sterilized: true,
    ownerName: "Sofía Torres",
    ownerId: "3",
    lastVisit: "2024-07-18",
    avatarColor: "bg-slate-200",
  },
  {
    id: "p7",
    name: "Thor",
    species: "dog",
    breed: "Husky Siberiano",
    age: 4,
    weight: 27,
    sex: "macho",
    sterilized: false,
    ownerName: "Sofía Torres",
    ownerId: "3",
    lastVisit: "2025-01-03",
    avatarColor: "bg-blue-200",
  },
  {
    id: "p8",
    name: "Nemo",
    species: "fish",
    breed: "Pez payaso",
    age: 1,
    sex: "macho",
    sterilized: false,
    ownerName: "Valentina Cruz",
    ownerId: "5",
    lastVisit: "2024-05-10",
    avatarColor: "bg-orange-200",
  },
  {
    id: "p9",
    name: "Iggy",
    species: "reptile",
    breed: "Iguana verde",
    age: 3,
    weight: 2.4,
    sex: "macho",
    sterilized: false,
    ownerName: "Valentina Cruz",
    ownerId: "5",
    lastVisit: "2024-04-22",
    avatarColor: "bg-lime-200",
  },
  {
    id: "p10",
    name: "Bolt",
    species: "dog",
    breed: "Dálmata",
    age: 5,
    weight: 24,
    sex: "macho",
    sterilized: true,
    ownerName: "Luis Hernández",
    ownerId: "6",
    lastVisit: "2024-12-15",
    avatarColor: "bg-gray-200",
  },
  {
    id: "p11",
    name: "Cleo",
    species: "cat",
    breed: "Maine Coon",
    age: 2,
    weight: 6.8,
    sex: "hembra",
    sterilized: true,
    ownerName: "Luis Hernández",
    ownerId: "6",
    lastVisit: "2025-01-10",
    avatarColor: "bg-teal-200",
  },
  {
    id: "p12",
    name: "Peanut",
    species: "hamster",
    breed: "Sirio",
    age: 1,
    weight: 0.15,
    sex: "macho",
    sterilized: false,
    ownerName: "Miguel Ángel Reyes",
    ownerId: "4",
    lastVisit: "2024-11-01",
    avatarColor: "bg-yellow-100",
  },
];

// ── Main ───────────────────────────────────────────────────────────────────
export const PetsList: React.FC = () => {
  const navigate = useNavigate();
  const { onlyPets, loading: isLoading } = usePetsStore();
  const [search, setSearch] = useState("");
  const [activeSpecies, setActiveSpecies] = useState("all");

  console.log("onlyPets", onlyPets);

  const pets = onlyPets;

  //ESPECIES DATA
  const presentSpecies = useMemo(() => {
    //NEW SET ELIMINACION DE DUPLICAODS
    const set = new Set(pets?.map((p) => p.specie.toLowerCase()));
    return [
      "all",
      ...Object.keys(SPECIES_CONFIG).filter((k) => k !== "all" && set.has(k)),
    ];
  }, [pets]);

  //FILTRADO POR INPUT Y CATEGORIA
  const filtered = useMemo(() => {
    //SOLO LA BUSQUEDA SIN ESPACIOS
    const searchWord = search.toLowerCase().trim();

    return (pets ?? []).filter((pet) => {
      const matchesSpecies =
        activeSpecies === "all" || pet.specie.toLowerCase() === activeSpecies;

      const matchesSearch =
        !searchWord ||
        pet.name.toLowerCase().includes(searchWord) ||
        pet.breed?.toLowerCase().includes(searchWord) ||
        pet.specie.toLowerCase().includes(searchWord) ||
        pet.owner_name.toLowerCase().includes(searchWord);

      return matchesSpecies && matchesSearch;
    });
  }, [pets, search, activeSpecies]);

  //CONTAR POR ESPECIE
  const countBySpecies = useMemo(() => {
    const petList = pets ?? [];

    const counts: Record<string, number> = {
      all: petList.length,
    };

    petList.forEach((pet) => {
      const s = pet.specie.toLowerCase();
      //SI NO HAY NADA TOMA O + 1
      //SI HAY UN VALOR LE SUMA 1
      //Y LO AGREGA AL OBJETO
      counts[s] = (counts[s] ?? 0) + 1;
    });
    return counts;
  }, [pets]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="mb-7 flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Mascotas
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {pets?.length} mascota{pets?.length !== 1 ? "s" : ""} registrada
              {pets?.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            to="/pets/new"
            className="md:hidden self-start md:self-auto flex gap-1 text-center items-center bg-green-200 hover:bg-green-300 text-green-900 font-semibold text-sm px-3 py-2 rounded-xl transition-colors"
          >
            <span className="">+</span>
            <span className="">Nueva Mascota</span>
          </Link>
        </div>

        {/* Search */}
        <div className="relative sm:ml-auto w-full sm:max-w-xs">
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
            placeholder="Nombre, raza, propietario..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-green-200 bg-white text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
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

        <Link
          to="/pets/new"
          className="hidden self-start md:self-auto md:flex items-center gap-2 bg-green-200 hover:bg-green-300 text-green-900 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
        >
          <span>+</span> Agregar Mascota
        </Link>
      </div>

      {/* ── Species filter pills ─────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {presentSpecies.map((sp) => {
          const cfg = SPECIES_CONFIG[sp];
          const isActive = activeSpecies === sp;
          return (
            <button
              key={sp}
              onClick={() => setActiveSpecies(sp)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-green-600 text-white border-green-600 shadow-md shadow-green-200"
                  : "bg-white text-gray-500 border-gray-200 hover:border-green-300 hover:text-green-700"
              }`}
            >
              <span>{cfg.emoji}</span>
              <span>{cfg.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {countBySpecies[sp] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/*LABEL DE RESULTADO */}
      {(search || activeSpecies !== "all") && (
        <p className="text-xs text-gray-400 mb-4">
          {filtered.length === 0
            ? "Sin resultados"
            : `${filtered.length} resultado${filtered.length !== 1 ? "s" : ""}`}
          {search && (
            <>
              {" "}
              para{" "}
              <span className="font-medium text-green-700">"{search}"</span>
            </>
          )}
          {activeSpecies !== "all" && (
            <> · {SPECIES_CONFIG[activeSpecies]?.label}</>
          )}
        </p>
      )}

      {/* ── LOADING SQUELETON ─────────────────────────────────────────── */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-2xl overflow-hidden border border-gray-100"
            >
              <div className="h-24 bg-green-100" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="flex gap-2">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="flex-1 h-10 bg-gray-50 rounded-xl"
                    />
                  ))}
                </div>
                <div className="h-3 bg-gray-50 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ESTADO VACIO ──────────────────────────────────────────────── */}
      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl mb-4">
            {activeSpecies !== "all"
              ? SPECIES_CONFIG[activeSpecies]?.emoji
              : "🐾"}
          </div>
          <p className="text-gray-500 font-medium">
            {search
              ? "No se encontraron mascotas"
              : "Sin mascotas en esta categoría"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {search
              ? "Intenta con otro término"
              : "Las mascotas registradas aparecerán aquí"}
          </p>
          {(search || activeSpecies !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setActiveSpecies("all");
              }}
              className="mt-4 text-sm text-green-600 hover:underline font-medium"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* ── Grid ─────────────────────────────────────────────────────── */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onClick={() => navigate(`/pets/${pet.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
