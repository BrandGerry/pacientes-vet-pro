import { getInitials } from "../../helpers/dataOfOwner";
import { OwnerWithPets } from "../../store/usePetsStore";
import { PetChip } from "./PetChip";

export const OwnerCard: React.FC<{
  owner: OwnerWithPets;
  onClick: () => void;
}> = ({ owner, onClick }) => {
  //MOSTRAR SOLO 3
  const visiblePets = owner.pets.slice(0, 3);
  const extraPets = owner.pets.length - visiblePets.length;

  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-white rounded-2xl border border-green-100 shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-200 p-5 flex flex-col gap-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="shrink-0 w-11 h-11 rounded-full bg-green-200 flex items-center justify-center overflow-hidden">
          {owner.avatarUrl ? (
            <img
              src={owner.avatarUrl}
              alt={owner.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-green-800 font-semibold text-sm">
              {getInitials(owner.name)}
            </span>
          )}
        </div>

        {/* Name & email */}
        <div className="min-w-0">
          <p className="font-semibold text-gray-800 truncate group-hover:text-green-700 transition-colors">
            {owner.name}
          </p>
          <p className="text-xs text-gray-400 truncate">{owner.email}</p>
        </div>

        {/* Arrow */}
        <div className="ml-auto shrink-0 text-gray-300 group-hover:text-green-500 group-hover:translate-x-0.5 transition-all">
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-green-50" />

      {/* Pets section */}
      <div>
        <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-2">
          {owner.pets.length === 0
            ? "Sin mascotas"
            : `${owner.pets.length} mascota${owner.pets.length > 1 ? "s" : ""}`}
        </p>
        {owner.pets.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {visiblePets.map((pet) => (
              <PetChip key={pet.id} pet={pet} />
            ))}
            {extraPets > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium border border-gray-200">
                +{extraPets} más
              </span>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">
            No hay mascotas registradas
          </p>
        )}
      </div>

      {/* Phone (optional) */}
      {owner.phone && (
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
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
          {owner.phone}
        </div>
      )}
    </button>
  );
};
