import { getPetEmoji } from "../../helpers/dataOfDashboard";
import { Pets } from "../../store/usePetsStore";

export const PetChip: React.FC<{ pet: Pets }> = ({ pet }) => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-medium border border-green-200 whitespace-nowrap">
    <span>{getPetEmoji(pet.specie)}</span>
    <span>{pet.name}</span>
  </span>
);
