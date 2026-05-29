import { useState } from "react";
import { Pets } from "../../store/usePetsStore";
import { getPetEmoji } from "../../helpers/dataOfDashboard";
import { formatDate, getPetAge } from "../../helpers/dataOfOwner";
import { VaccineRow } from "./VaccineRow";

// ── PetCard ────────────────────────────────────────────────────────────────
export const PetCard: React.FC<{
  pet: Pets;
  index: number;
}> = ({ pet, index }) => {
  const [expanded, setExpanded] = useState(false);
  const lastMedical = pet.medical?.[0];
  return (
    <div
      className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Card Header */}
      <div className="bg-linear-to-r from-green-50 to-white px-5 py-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-green-200 flex items-center justify-center text-2xl shrink-0 shadow-inner">
          {getPetEmoji(pet.specie)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 text-lg leading-tight">
            {pet.name}
          </h3>
          <p className="text-sm text-green-700 font-medium">
            {pet.breed ?? pet.specie}
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
          { label: "Edad", value: getPetAge(pet.birth_date) },
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
                    <VaccineRow key={v.vaccine_name} vaccine={v} />
                  ))}
                </div>
              </div>
            )}

            {/* Last visit */}
            {pet.last_visit && lastMedical && (
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-2">
                  Última visita
                </p>
                <div className="rounded-xl border border-green-100 p-3 bg-green-50/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      {pet.medical?.[0]?.symptoms}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(pet.last_visit)}
                    </span>
                  </div>
                  {/* {pet.lastVisit.vet && (
                    <p className="text-xs text-green-700">
                      {pet.lastVisit.vet}
                    </p>
                  )} */}
                  {pet.medical?.[0]?.notes && (
                    <p className="text-xs text-gray-500 italic border-t border-green-100 pt-1.5">
                      {pet.medical?.[0]?.notes}
                    </p>
                  )}
                </div>
              </div>
            )}

            {!pet.vaccines?.length && (
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
