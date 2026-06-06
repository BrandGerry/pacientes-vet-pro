import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pets } from "../../store/usePetsStore";
import {
  calcAge,
  formatDateLong,
  isOverdue,
  SPECIES_CONFIG_IND,
} from "../../helpers/dataOfPets";
import { Chip } from "../../components/pets/Chip";
import { SectionTitle } from "../../components/pets/SectionTitle";
import { EmptyBlock } from "../../components/pets/EmptyBlock";
import { VaccineRow } from "../../components/pets/VaccineRow";
import { MedicalCard } from "../../components/pets/MedicalCard";
import { supabase } from "../../lib/supabase";

const MOCK_PET: Pets = {
  id: "p1",
  created_at: new Date("2022-03-10"),
  owner_id: "1",
  owner_name: "Ana García",
  name: "Luna",
  specie: "dog",
  breed: "Golden Retriever",
  sex: "hembra",
  birth_date: "2021-06-15",
  weight: "28",
  sterilized: true,
  blood_type: "DEA 1.1+",
  is_deceased: false,
  color: "Dorado",
  last_visit: "2024-11-20",
  vaccines: [
    {
      id: "v1",
      pet_id: "p1",
      vaccine_name: "Rabia",
      aplication_date: "2024-01-10",
      next_dose_date: "2025-01-10",
      notes: "Sin reacciones adversas.",
      created_at: "2024-01-10",
    },
    {
      id: "v2",
      pet_id: "p1",
      vaccine_name: "Moquillo",
      aplication_date: "2024-01-10",
      next_dose_date: "2025-01-10",
      notes: "",
      created_at: "2024-01-10",
    },
    {
      id: "v3",
      pet_id: "p1",
      vaccine_name: "Parvovirus",
      aplication_date: "2023-01-12",
      next_dose_date: "2024-01-12",
      notes: "Refuerzo anual aplicado.",
      created_at: "2023-01-12",
    },
  ],
  medical: [
    {
      id: "m1",
      pet_id: "p1",
      created_at: new Date("2024-11-20"),
      veterinarian_id: "vet1",
      symptoms: "Letargo leve, pérdida de apetito",
      diagnosis: "Gastroenteritis viral leve",
      treatment: "Dieta blanda por 5 días, probióticos",
      notes:
        "Respuesta positiva al tratamiento. Cita de seguimiento en 2 semanas.",
    },
    {
      id: "m2",
      pet_id: "p1",
      created_at: new Date("2024-07-05"),
      veterinarian_id: "vet2",
      symptoms: "Rascado excesivo en orejas, sacudida de cabeza",
      diagnosis: "Otitis externa bacteriana",
      treatment: "Limpieza auricular + gotas antibióticas 10 días",
      notes: null,
    },
  ],
};

const getSpeciesCfg = (specie: string) =>
  SPECIES_CONFIG_IND[specie.toLowerCase()] ?? {
    emoji: "🐾",
    bg: "from-green-100 to-green-50",
    text: "text-green-700",
  };

// ──COMPONENTE─────────────────────────────────────────────────────────
export const PetsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  //STATE
  const [pet, setPet] = useState<Pets | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"vaccines" | "medical">(
    "vaccines"
  );

  useEffect(() => {
    const fetchPetId = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("pets")
        .select(
          `
            *,
            vaccines (*),
            medical (*)
          `
        )
        .eq("id", id)
        .single();

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setPet(data);
      setLoading(false);
    };

    fetchPetId();
  }, [id]);

  // ── LOADING ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
        <div className="animate-pulse max-w-3xl mx-auto space-y-5">
          <div className="h-6 w-24 bg-green-100 rounded-lg" />
          <div className="h-52 bg-white rounded-2xl border border-green-100" />
          <div className="h-64 bg-white rounded-2xl border border-green-100" />
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
        <span className="text-4xl">🐾</span>
        <p className="text-gray-500 font-medium">Mascota no encontrada</p>
        <button
          onClick={() => navigate("/pets")}
          className="text-sm text-green-600 hover:underline"
        >
          ← Volver a mascotas
        </button>
      </div>
    );
  }

  const cfg = getSpeciesCfg(pet.specie);
  const vaccineCount = pet.vaccines?.length ?? 0;
  const medicalCount = pet.medical?.length ?? 0;
  const overdueVaccines =
    pet.vaccines?.filter((vaccine) => isOverdue(vaccine.next_dose_date))
      .length ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* ── Back ──────────────────────────────────────────────────── */}
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
          Mascotas
        </button>

        {/* ──INFO CARD─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">
          {/* Species gradient header */}
          <div
            className={`bg-linear-to-br ${cfg.bg} px-6 pt-7 pb-5 flex items-center gap-5`}
          >
            <div className="w-20 h-20 rounded-2xl bg-white/70 backdrop-blur-sm flex items-center justify-center text-5xl shadow-sm border border-white shrink-0">
              {cfg.emoji}
            </div>
            <div className="pb-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                  {pet.name}
                </h1>
                {pet.is_deceased && (
                  <Chip color="bg-gray-100 text-gray-500 border-gray-300">
                    † Fallecido
                  </Chip>
                )}
              </div>
              <p className={`text-sm font-medium ${cfg.text}`}>
                {pet.breed} · {pet.specie}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <Chip>
                  {pet.sex === "hembra" ? "♀" : "♂"} {pet.sex}
                </Chip>
                {pet.sterilized && <Chip>✓ Esterilizado/a</Chip>}
                {pet.blood_type && <Chip>🩸 {pet.blood_type}</Chip>}
                {pet.color && <Chip>🎨 {pet.color}</Chip>}
              </div>
            </div>
          </div>

          {/*FILA DE STATS*/}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-green-50 border-t border-green-50">
            {[
              { label: "Edad", value: calcAge(pet.birth_date) },
              { label: "Peso", value: pet.weight ? `${pet.weight} kg` : "—" },
              { label: "Nacimiento", value: formatDateLong(pet.birth_date) },
              { label: "Última visita", value: formatDateLong(pet.last_visit) },
            ].map((stats) => (
              <div key={stats.label} className="py-4 text-center px-2">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                  {stats.label}
                </p>
                <p className="text-sm font-bold text-gray-700 mt-0.5">
                  {stats.value}
                </p>
              </div>
            ))}
          </div>

          {/* Owner link */}
          <div className="px-5 py-3 border-t border-green-50 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-green-200 flex items-center justify-center text-xs font-bold text-green-800 shrink-0">
              {pet.owner_name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                Propietario
              </p>
              <p className="text-sm font-semibold text-gray-700 truncate">
                {pet.owner_name}
              </p>
            </div>
            <button
              onClick={() => navigate(`/owners/${pet.owner_id}`)}
              className="shrink-0 text-xs text-green-600 hover:underline font-medium flex items-center gap-1"
            >
              Ver perfil
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Tabs: Vacunas / Historial médico ──────────────────────── */}
        <div>
          <div className="flex gap-1 bg-green-50 p-1 rounded-xl border border-green-100 mb-5">
            {(["vaccines", "medical"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  activeTab === tab
                    ? "bg-white shadow-sm text-green-700 border border-green-200"
                    : "text-gray-400 hover:text-green-600"
                }`}
              >
                {tab === "vaccines" ? (
                  <>
                    💉 Vacunas
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                        activeTab === tab
                          ? overdueVaccines > 0
                            ? "bg-red-100 text-red-500"
                            : "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {vaccineCount}
                    </span>
                  </>
                ) : (
                  <>
                    🩺 Historial médico
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                        activeTab === tab
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {medicalCount}
                    </span>
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Vaccines tab */}
          {activeTab === "vaccines" && (
            <div className="space-y-3">
              {overdueVaccines > 0 && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                    />
                  </svg>
                  <span>
                    <strong>{overdueVaccines}</strong> vacuna
                    {overdueVaccines !== 1 ? "s" : ""} vencida
                    {overdueVaccines !== 1 ? "s" : ""} — se recomienda contactar
                    al propietario
                  </span>
                </div>
              )}

              <SectionTitle
                title="Vacunas"
                count={vaccineCount}
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
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                }
              />

              {vaccineCount === 0 ? (
                <EmptyBlock message="Sin vacunas registradas" />
              ) : (
                pet.vaccines!.map((vaccine, i) => (
                  <VaccineRow key={vaccine.id} vaccine={vaccine} index={i} />
                ))
              )}
            </div>
          )}

          {/* Medical tab */}
          {activeTab === "medical" && (
            <div className="space-y-3">
              <SectionTitle
                title="Historial médico"
                count={medicalCount}
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                }
              />

              {medicalCount === 0 ? (
                <EmptyBlock message="Sin registros médicos" />
              ) : (
                pet.medical!.map((m, i) => (
                  <MedicalCard key={m.id} record={m} index={i} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
