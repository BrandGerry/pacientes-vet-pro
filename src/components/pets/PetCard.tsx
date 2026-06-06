import { getPetAge } from "../../helpers/dataOfOwner";
import {
  daysSince,
  formatDate,
  SPECIES_CONFIG,
} from "../../helpers/dataOfPets";
import { Pets } from "../../store/usePetsStore";

const getSpeciesCfg = (species: string) =>
  SPECIES_CONFIG[species.toLowerCase()] ?? {
    emoji: "🐾",
    label: species,
    bg: "bg-green-100",
    text: "text-red-700",
    border: "border-glue-200",
  };

export const PetCard: React.FC<{ pet: Pets; onClick: () => void }> = ({
  pet,
  onClick,
}) => {
  const cfg = getSpeciesCfg(pet.specie);
  const days = pet.last_visit ? daysSince(pet.last_visit) : null;

  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-green-200 transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 cursor-pointer"
    >
      {/* Species color strip + big emoji */}
      <div className={`relative ${cfg.bg} px-5 pt-6 pb-4 flex items-end gap-4`}>
        {/* Top-right: species badge */}
        <span
          className={`absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.text} ${cfg.border} bg-white/70 backdrop-blur-sm`}
        >
          {cfg.label}
        </span>

        {/* Giant emoji */}
        <div className="w-16 h-16 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center text-4xl shadow-sm border border-white/80 shrink-0 group-hover:scale-105 transition-transform duration-200">
          {cfg.emoji}
        </div>

        {/* Name & breed */}
        <div className="pb-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-800 leading-tight truncate group-hover:text-green-700 transition-colors">
            {pet.name}
          </h3>
          <p className="text-xs text-gray-500 truncate">
            {pet.breed ?? pet.specie}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-3">
        {/* Stats row */}
        <div className="flex gap-3 text-center">
          {[
            { label: "Edad", value: getPetAge(pet.birth_date) },
            ,
            { label: "Peso", value: pet.weight ? `${pet.weight} kg` : "—" },
            {
              label: "Sexo",
              value: pet.sex
                ? (pet.sex === "macho" ? "♂" : "♀") + " " + pet.sex
                : "—",
            },
          ].map((s) => (
            <div key={s?.label} className="flex-1 bg-gray-50 rounded-xl py-2">
              <p className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold">
                {s?.label}
              </p>
              <p className="text-xs font-semibold text-gray-700 mt-0.5 capitalize">
                {s?.value}
              </p>
            </div>
          ))}
        </div>

        {/* Owner */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-5 h-5 rounded-full bg-green-200 flex items-center justify-center text-[10px] font-bold text-green-800 shrink-0">
            {pet && pet.owner_name && pet.owner_name[0]}
          </div>
          <span className="truncate">{pet.owner_name}</span>
          {pet.sterilized && (
            <span className="ml-auto shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 font-medium">
              ✓ Ester.
            </span>
          )}
        </div>

        {/* Last visit */}
        {days !== null && (
          <div
            className={`flex items-center gap-1.5 text-xs rounded-lg px-2.5 py-1.5 ${
              days > 180
                ? "bg-red-50 text-red-500 border border-red-100"
                : days > 90
                ? "bg-yellow-50 text-yellow-600 border border-yellow-100"
                : "bg-green-50 text-green-700 border border-green-100"
            }`}
          >
            <svg
              className="w-3 h-3 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {days === 0
                ? "Visita hoy"
                : `Última visita hace ${days} día${days !== 1 ? "s" : ""}`}
              {" · "}
              {formatDate(pet.last_visit!)}
            </span>
          </div>
        )}
      </div>
    </button>
  );
};
