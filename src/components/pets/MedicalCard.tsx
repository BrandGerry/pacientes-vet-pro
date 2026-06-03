import { formatDateLong } from "../../helpers/dataOfPets";
import { Medicals } from "../../store/useAppointmentStore";

export const MedicalCard: React.FC<{ record: Medicals; index: number }> = ({
  record,
  index,
}) => (
  <div
    className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden"
    style={{ animationDelay: `${index * 70}ms` }}
  >
    {/* Header */}
    <div className="flex items-center justify-between px-4 py-3 bg-green-50/60 border-b border-green-100">
      <div className="flex items-center gap-2">
        <svg
          className="w-3.5 h-3.5 text-green-500"
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
        <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">
          Consulta
        </span>
      </div>
      <span className="text-xs text-gray-400">
        {formatDateLong(record.created_at.toString())}
      </span>
    </div>

    {/* Body */}
    <div className="p-4 grid sm:grid-cols-3 gap-4">
      {[
        { label: "Síntomas", value: record.symptoms, icon: "🩺" },
        { label: "Diagnóstico", value: record.diagnosis, icon: "🔬" },
        { label: "Tratamiento", value: record.treatment, icon: "💊" },
      ].map((item) => (
        <div key={item.label}>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
            {item.icon} {item.label}
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">{item.value}</p>
        </div>
      ))}
    </div>

    {record.notes && (
      <div className="px-4 pb-4">
        <div className="rounded-lg bg-green-50 border border-green-100 px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wider text-green-600 font-semibold mb-1">
            📝 Notas
          </p>
          <p className="text-xs text-gray-600 italic leading-relaxed">
            {record.notes}
          </p>
        </div>
      </div>
    )}
  </div>
);
