import { MedicalFormData } from "../../pages/pets/PetsForm";
import { ErrorMsg } from "./ErrorMsj";
import { Label } from "./Label";

// ── Step 2: Medical ────────────────────────────────────────────────────────
const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-green-200 bg-white text-sm text-gray-700 placeholder-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition";

export const StepMedical: React.FC<{
  data: MedicalFormData;
  errors: Partial<Record<keyof MedicalFormData, string>>;
  onChange: (field: keyof MedicalFormData, value: string) => void;
}> = ({ data, errors, onChange }) => (
  <div className="space-y-5">
    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-green-50 border border-green-100">
      <span className="text-lg">🩺</span>
      <p className="text-xs text-green-700 leading-relaxed">
        Registra el motivo de esta primera consulta. Esta información quedará en
        el historial médico de la mascota.
      </p>
    </div>

    <div>
      <Label required>Síntomas</Label>
      <textarea
        rows={3}
        placeholder="Describe los síntomas que presenta la mascota..."
        value={data.symptoms}
        onChange={(e) => onChange("symptoms", e.target.value)}
        className={`${inputCls} resize-none`}
      />
      <ErrorMsg msg={errors.symptoms} />
    </div>

    <div>
      <Label required>Diagnóstico</Label>
      <textarea
        rows={3}
        placeholder="Diagnóstico del veterinario..."
        value={data.diagnosis}
        onChange={(e) => onChange("diagnosis", e.target.value)}
        className={`${inputCls} resize-none`}
      />
      <ErrorMsg msg={errors.diagnosis} />
    </div>

    <div>
      <Label required>Tratamiento</Label>
      <textarea
        rows={3}
        placeholder="Tratamiento indicado, medicamentos, dosis..."
        value={data.treatment}
        onChange={(e) => onChange("treatment", e.target.value)}
        className={`${inputCls} resize-none`}
      />
      <ErrorMsg msg={errors.treatment} />
    </div>

    <div>
      <Label>Notas adicionales</Label>
      <textarea
        rows={2}
        placeholder="Observaciones, indicaciones de seguimiento..."
        value={data.notes}
        onChange={(e) => onChange("notes", e.target.value)}
        className={`${inputCls} resize-none`}
      />
    </div>
  </div>
);
