import { formatDateLong, isOverdue } from "../../helpers/dataOfPets";
import { Vaccines } from "../../store/usePetsStore";

export const VaccineRow: React.FC<{ vaccine: Vaccines; index: number }> = ({
  vaccine,
  index,
}) => {
  const overdue = isOverdue(vaccine.next_dose_date);
  const noDue = !vaccine.next_dose_date;

  return (
    <div
      className="bg-white rounded-xl border border-green-100 p-4 flex flex-col sm:flex-row sm:items-center gap-3 shadow-sm"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Status dot */}
      <div
        className={`shrink-0 w-2.5 h-2.5 rounded-full mt-1 sm:mt-0 ${
          noDue ? "bg-gray-300" : overdue ? "bg-red-400" : "bg-green-400"
        }`}
      />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm">
          {vaccine.vaccine_name}
        </p>
        {vaccine.notes && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">
            {vaccine.notes}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 sm:text-right text-xs shrink-0">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
            Aplicada
          </p>
          <p className="text-gray-600 font-medium">
            {formatDateLong(vaccine.aplication_date)}
          </p>
        </div>
        {vaccine.next_dose_date && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
              Próxima dosis
            </p>
            <p
              className={`font-semibold ${
                overdue ? "text-red-500" : "text-green-600"
              }`}
            >
              {overdue ? "⚠ Vencida · " : ""}
              {formatDateLong(vaccine.next_dose_date)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
