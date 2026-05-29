import { formatDate, isOverdue } from "../../helpers/dataOfOwner";
import { Vaccines } from "../../store/usePetsStore";

export const VaccineRow: React.FC<{ vaccine: Vaccines }> = ({ vaccine }) => {
  const overdue = isOverdue(vaccine.next_dose_date);
  return (
    <div className="flex items-center justify-between py-2 border-b border-green-50 last:border-0">
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            overdue ? "bg-red-400" : "bg-green-400"
          }`}
        />
        <span className="text-sm text-gray-700">{vaccine.vaccine_name}</span>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-400">
          {formatDate(vaccine.aplication_date)}
        </p>
        {vaccine.next_dose_date && (
          <p
            className={`text-xs font-medium ${
              overdue ? "text-red-500" : "text-green-600"
            }`}
          >
            {overdue
              ? "Vencida"
              : `Próx. ${formatDate(vaccine.next_dose_date)}`}
          </p>
        )}
      </div>
    </div>
  );
};
