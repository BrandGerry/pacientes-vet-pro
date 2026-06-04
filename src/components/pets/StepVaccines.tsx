import { VaccineFormData } from "../../pages/pets/PetsForm";
import { ErrorMsg } from "./ErrorMsj";
import { Label } from "./Label";

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-green-200 bg-white text-sm text-gray-700 placeholder-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition";

// ── Step 3: Vaccines ───────────────────────────────────────────────────────
export const StepVaccines: React.FC<{
  vaccines: VaccineFormData[];
  onAdd: () => void;
  onRemove: (key: number) => void;
  onChange: (key: number, field: keyof VaccineFormData, value: string) => void;
  errors: Record<number, Partial<Record<keyof VaccineFormData, string>>>;
}> = ({ vaccines, onAdd, onRemove, onChange, errors }) => (
  <div className="space-y-4">
    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-green-50 border border-green-100">
      <span className="text-lg">💉</span>
      <p className="text-xs text-green-700 leading-relaxed">
        Agrega las vacunas que ya tiene aplicadas. Este paso es opcional —
        puedes añadir más vacunas después.
      </p>
    </div>

    {vaccines.length === 0 && (
      <div className="flex flex-col items-center justify-center py-10 rounded-2xl border border-dashed border-green-200 bg-green-50/40 text-center">
        <span className="text-3xl mb-2">💉</span>
        <p className="text-sm text-gray-400">Sin vacunas agregadas aún</p>
      </div>
    )}

    {vaccines.map((v, i) => (
      <div
        key={v._key}
        className="bg-white rounded-2xl border border-green-100 shadow-sm p-5 space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-green-600">
            Vacuna {i + 1}
          </span>
          <button
            type="button"
            onClick={() => onRemove(v._key)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
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
        </div>

        {/* Name */}
        <div>
          <Label required>Nombre de la vacuna</Label>
          <input
            type="text"
            placeholder="Ej. Rabia, Moquillo, Parvovirus..."
            value={v.vaccine_name}
            onChange={(e) => onChange(v._key, "vaccine_name", e.target.value)}
            className={inputCls}
          />
          <ErrorMsg msg={errors[v._key]?.vaccine_name} />
        </div>

        {/* Dates */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label required>Fecha de aplicación</Label>
            <input
              type="date"
              value={v.aplication_date}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                onChange(v._key, "aplication_date", e.target.value)
              }
              className={inputCls}
            />
            <ErrorMsg msg={errors[v._key]?.aplication_date} />
          </div>
          <div>
            <Label>Próxima dosis</Label>
            <input
              type="date"
              value={v.next_dose_date}
              onChange={(e) =>
                onChange(v._key, "next_dose_date", e.target.value)
              }
              className={inputCls}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label>Notas</Label>
          <input
            type="text"
            placeholder="Ej. Sin reacciones adversas"
            value={v.notes}
            onChange={(e) => onChange(v._key, "notes", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
    ))}

    <button
      type="button"
      onClick={onAdd}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-green-300 text-green-600 text-sm font-semibold hover:bg-green-50 hover:border-green-400 transition-all"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      Agregar vacuna
    </button>
  </div>
);
