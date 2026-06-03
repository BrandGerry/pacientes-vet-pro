import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Types ──────────────────────────────────────────────────────────────────
interface PetFormData {
  // Básicos
  name: string;
  specie: string;
  breed: string;
  sex: string;
  birth_date: string;
  color: string;
  weight: string;
  blood_type: string;
  sterilized: boolean;
  // Propietario
  owner_id: string;
  // Vacunas
  vaccines: VaccineFormData[];
  // Consulta inicial
  medical: MedicalFormData;
}

interface VaccineFormData {
  _key: number;
  vaccine_name: string;
  aplication_date: string;
  next_dose_date: string;
  notes: string;
}

interface MedicalFormData {
  symptoms: string;
  diagnosis: string;
  treatment: string;
  notes: string;
}

// ── Mock owners (reemplaza con tu store) ───────────────────────────────────
const MOCK_OWNERS = [
  { id: "1", name: "Ana García" },
  { id: "2", name: "Carlos Mendoza" },
  { id: "3", name: "Sofía Torres" },
  { id: "4", name: "Miguel Ángel Reyes" },
  { id: "5", name: "Valentina Cruz" },
  { id: "6", name: "Luis Hernández" },
];

const SPECIES = [
  "dog",
  "cat",
  "bird",
  "rabbit",
  "hamster",
  "fish",
  "reptile",
  "otro",
];
const SPECIES_LABELS: Record<string, string> = {
  dog: "🐶 Perro",
  cat: "🐱 Gato",
  bird: "🐦 Ave",
  rabbit: "🐰 Conejo",
  hamster: "🐹 Hámster",
  fish: "🐠 Pez",
  reptile: "🦎 Reptil",
  otro: "🐾 Otro",
};
const BLOOD_TYPES = [
  "DEA 1.1+",
  "DEA 1.1-",
  "DEA 1.2+",
  "DEA 1.2-",
  "A",
  "B",
  "AB",
  "Desconocido",
];

const EMPTY_VACCINE = (): VaccineFormData => ({
  _key: Date.now() + Math.random(),
  vaccine_name: "",
  aplication_date: "",
  next_dose_date: "",
  notes: "",
});

const EMPTY_MEDICAL: MedicalFormData = {
  symptoms: "",
  diagnosis: "",
  treatment: "",
  notes: "",
};

const INITIAL: PetFormData = {
  name: "",
  specie: "",
  breed: "",
  sex: "",
  birth_date: "",
  color: "",
  weight: "",
  blood_type: "",
  sterilized: false,
  owner_id: "",
  vaccines: [],
  medical: { ...EMPTY_MEDICAL },
};

// ── Helpers ────────────────────────────────────────────────────────────────
type Step = "info" | "medical" | "vaccines";
const STEPS: { id: Step; label: string; emoji: string }[] = [
  { id: "info", label: "Datos de la mascota", emoji: "🐾" },
  { id: "medical", label: "Consulta inicial", emoji: "🩺" },
  { id: "vaccines", label: "Vacunas", emoji: "💉" },
];

// ── Small UI ───────────────────────────────────────────────────────────────
const Label: React.FC<{ children: React.ReactNode; required?: boolean }> = ({
  children,
  required,
}) => (
  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
    {children}
    {required && <span className="text-red-400 ml-0.5">*</span>}
  </label>
);

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-green-200 bg-white text-sm text-gray-700 placeholder-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition";
const selectCls = `${inputCls} cursor-pointer`;

const ErrorMsg: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? <p className="mt-1 text-xs text-red-500">{msg}</p> : null;

// ── Step indicator ─────────────────────────────────────────────────────────
const StepBar: React.FC<{ current: Step; completed: Set<Step> }> = ({
  current,
  completed,
}) => (
  <div className="flex items-center gap-0 mb-8">
    {STEPS.map((step, i) => {
      const isActive = current === step.id;
      const isDone = completed.has(step.id);
      return (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-base font-bold border-2 transition-all duration-200 ${
                isDone
                  ? "bg-green-500 border-green-500 text-white shadow-md shadow-green-200"
                  : isActive
                  ? "bg-white border-green-400 text-green-600 shadow-sm"
                  : "bg-gray-50 border-gray-200 text-gray-400"
              }`}
            >
              {isDone ? "✓" : step.emoji}
            </div>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wide text-center leading-tight ${
                isActive
                  ? "text-green-600"
                  : isDone
                  ? "text-green-500"
                  : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`h-0.5 flex-1 mb-5 mx-1 rounded transition-colors duration-300 ${
                isDone ? "bg-green-400" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ── Step 1: Pet info ───────────────────────────────────────────────────────
const StepInfo: React.FC<{
  data: PetFormData;
  errors: Partial<Record<keyof PetFormData, string>>;
  onChange: (field: keyof PetFormData, value: unknown) => void;
}> = ({ data, errors, onChange }) => (
  <div className="space-y-5">
    {/* Owner */}
    <div>
      <Label required>Propietario</Label>
      <select
        value={data.owner_id}
        onChange={(e) => onChange("owner_id", e.target.value)}
        className={selectCls}
      >
        <option value="">Seleccionar propietario...</option>
        {MOCK_OWNERS.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
      <ErrorMsg msg={errors.owner_id} />
    </div>

    {/* Name + Species */}
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <Label required>Nombre</Label>
        <input
          type="text"
          placeholder="Ej. Luna"
          value={data.name}
          onChange={(e) => onChange("name", e.target.value)}
          className={inputCls}
        />
        <ErrorMsg msg={errors.name} />
      </div>
      <div>
        <Label required>Especie</Label>
        <select
          value={data.specie}
          onChange={(e) => onChange("specie", e.target.value)}
          className={selectCls}
        >
          <option value="">Seleccionar...</option>
          {SPECIES.map((s) => (
            <option key={s} value={s}>
              {SPECIES_LABELS[s]}
            </option>
          ))}
        </select>
        <ErrorMsg msg={errors.specie} />
      </div>
    </div>

    {/* Breed + Color */}
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <Label>Raza</Label>
        <input
          type="text"
          placeholder="Ej. Golden Retriever"
          value={data.breed}
          onChange={(e) => onChange("breed", e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <Label>Color</Label>
        <input
          type="text"
          placeholder="Ej. Dorado"
          value={data.color}
          onChange={(e) => onChange("color", e.target.value)}
          className={inputCls}
        />
      </div>
    </div>

    {/* Sex + Birth date */}
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <Label required>Sexo</Label>
        <select
          value={data.sex}
          onChange={(e) => onChange("sex", e.target.value)}
          className={selectCls}
        >
          <option value="">Seleccionar...</option>
          <option value="macho">♂ Macho</option>
          <option value="hembra">♀ Hembra</option>
        </select>
        <ErrorMsg msg={errors.sex} />
      </div>
      <div>
        <Label required>Fecha de nacimiento</Label>
        <input
          type="date"
          value={data.birth_date}
          onChange={(e) => onChange("birth_date", e.target.value)}
          className={inputCls}
          max={new Date().toISOString().split("T")[0]}
        />
        <ErrorMsg msg={errors.birth_date} />
      </div>
    </div>

    {/* Weight + Blood type */}
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <Label>Peso (kg)</Label>
        <input
          type="number"
          step="0.1"
          min="0"
          placeholder="Ej. 28.5"
          value={data.weight}
          onChange={(e) => onChange("weight", e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <Label>Tipo de sangre</Label>
        <select
          value={data.blood_type}
          onChange={(e) => onChange("blood_type", e.target.value)}
          className={selectCls}
        >
          <option value="">Seleccionar...</option>
          {BLOOD_TYPES.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Sterilized */}
    <div>
      <button
        type="button"
        onClick={() => onChange("sterilized", !data.sterilized)}
        className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl border-2 w-full transition-all duration-150 ${
          data.sterilized
            ? "border-green-400 bg-green-50"
            : "border-gray-200 bg-white"
        }`}
      >
        <div
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
            data.sterilized
              ? "bg-green-500 border-green-500"
              : "border-gray-300"
          }`}
        >
          {data.sterilized && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <div className="text-left">
          <p
            className={`text-sm font-semibold ${
              data.sterilized ? "text-green-700" : "text-gray-600"
            }`}
          >
            Esterilizado/a
          </p>
          <p className="text-xs text-gray-400">
            La mascota ha sido esterilizada o castrada
          </p>
        </div>
      </button>
    </div>
  </div>
);

// ── Step 2: Medical ────────────────────────────────────────────────────────
const StepMedical: React.FC<{
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

// ── Step 3: Vaccines ───────────────────────────────────────────────────────
const StepVaccines: React.FC<{
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

// ── Main Component ─────────────────────────────────────────────────────────
export const PetsForm: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("info");
  const [completed, setCompleted] = useState<Set<Step>>(new Set());
  const [form, setForm] = useState<PetFormData>(INITIAL);
  const [errors, setErrors] = useState<
    Partial<Record<keyof PetFormData, string>>
  >({});
  const [medErrors, setMedErrors] = useState<
    Partial<Record<keyof MedicalFormData, string>>
  >({});
  const [vacErrors, setVacErrors] = useState<
    Record<number, Partial<Record<keyof VaccineFormData, string>>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // ── Field handlers ─────────────────────────────────────────────────────
  const handleField = (field: keyof PetFormData, value: unknown) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleMedical = (field: keyof MedicalFormData, value: string) => {
    setForm((f) => ({ ...f, medical: { ...f.medical, [field]: value } }));
    setMedErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleVaccineChange = (
    key: number,
    field: keyof VaccineFormData,
    value: string
  ) => {
    setForm((f) => ({
      ...f,
      vaccines: f.vaccines.map((v) =>
        v._key === key ? { ...v, [field]: value } : v
      ),
    }));
    setVacErrors((e) => ({ ...e, [key]: { ...e[key], [field]: undefined } }));
  };

  const addVaccine = () =>
    setForm((f) => ({ ...f, vaccines: [...f.vaccines, EMPTY_VACCINE()] }));
  const removeVaccine = (key: number) =>
    setForm((f) => ({
      ...f,
      vaccines: f.vaccines.filter((v) => v._key !== key),
    }));

  // ── Validation ─────────────────────────────────────────────────────────
  const validateInfo = () => {
    const e: Partial<Record<keyof PetFormData, string>> = {};
    if (!form.owner_id) e.owner_id = "Selecciona un propietario";
    if (!form.name.trim()) e.name = "El nombre es obligatorio";
    if (!form.specie) e.specie = "Selecciona una especie";
    if (!form.sex) e.sex = "Selecciona el sexo";
    if (!form.birth_date) e.birth_date = "Indica la fecha de nacimiento";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateMedical = () => {
    const e: Partial<Record<keyof MedicalFormData, string>> = {};
    if (!form.medical.symptoms.trim()) e.symptoms = "Describe los síntomas";
    if (!form.medical.diagnosis.trim())
      e.diagnosis = "El diagnóstico es obligatorio";
    if (!form.medical.treatment.trim())
      e.treatment = "El tratamiento es obligatorio";
    setMedErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateVaccines = () => {
    const e: Record<
      number,
      Partial<Record<keyof VaccineFormData, string>>
    > = {};
    form.vaccines.forEach((v) => {
      const ve: Partial<Record<keyof VaccineFormData, string>> = {};
      if (!v.vaccine_name.trim()) ve.vaccine_name = "Nombre requerido";
      if (!v.aplication_date) ve.aplication_date = "Fecha requerida";
      if (Object.keys(ve).length > 0) e[v._key] = ve;
    });
    setVacErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Navigation ─────────────────────────────────────────────────────────
  const goNext = () => {
    if (step === "info") {
      if (!validateInfo()) return;
      setCompleted((c) => new Set([...c, "info"]));
      setStep("medical");
    } else if (step === "medical") {
      if (!validateMedical()) return;
      setCompleted((c) => new Set([...c, "medical"]));
      setStep("vaccines");
    }
  };

  const goBack = () => {
    if (step === "medical") setStep("info");
    if (step === "vaccines") setStep("medical");
  };

  // ── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateVaccines()) return;
    setSubmitting(true);

    // 👇 Reemplaza con tu llamada al store / API real
    console.log("Submitting:", form);
    await new Promise((r) => setTimeout(r, 1200));

    setSubmitting(false);
    setCompleted((c) => new Set([...c, "vaccines"]));
    setSuccess(true);
  };

  // ── Success screen ─────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-10 max-w-sm w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mx-auto">
            🐾
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            ¡Mascota registrada!
          </h2>
          <p className="text-sm text-gray-400">
            <strong className="text-gray-700">{form.name}</strong> fue agregada
            exitosamente con su consulta inicial
            {form.vaccines.length > 0 &&
              ` y ${form.vaccines.length} vacuna${
                form.vaccines.length !== 1 ? "s" : ""
              }`}
            .
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => navigate("/pets")}
              className="w-full py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition shadow-sm shadow-green-200"
            >
              Ver todas las mascotas
            </button>
            <button
              onClick={() => {
                setForm(INITIAL);
                setStep("info");
                setCompleted(new Set());
                setSuccess(false);
              }}
              className="w-full py-2.5 rounded-xl border border-green-200 text-green-700 text-sm font-semibold hover:bg-green-50 transition"
            >
              Registrar otra mascota
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-green-700 transition-colors group mb-6"
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
          Cancelar
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Registrar mascota
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Completa la información de la mascota y su primera consulta
          </p>
        </div>

        {/* Step bar */}
        <StepBar current={step} completed={completed} />

        {/* Card */}
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6 sm:p-8">
          {/* Step title */}
          <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-green-50">
            <span className="text-xl">
              {STEPS.find((s) => s.id === step)?.emoji}
            </span>
            <h2 className="font-bold text-gray-700">
              {STEPS.find((s) => s.id === step)?.label}
            </h2>
          </div>

          {/* Step content */}
          {step === "info" && (
            <StepInfo data={form} errors={errors} onChange={handleField} />
          )}
          {step === "medical" && (
            <StepMedical
              data={form.medical}
              errors={medErrors}
              onChange={handleMedical}
            />
          )}
          {step === "vaccines" && (
            <StepVaccines
              vaccines={form.vaccines}
              errors={vacErrors}
              onAdd={addVaccine}
              onRemove={removeVaccine}
              onChange={handleVaccineChange}
            />
          )}

          {/* Footer nav */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-green-50">
            <button
              type="button"
              onClick={goBack}
              disabled={step === "info"}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:border-green-300 hover:text-green-700 disabled:opacity-30 disabled:pointer-events-none transition"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Anterior
            </button>

            {step !== "vaccines" ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition shadow-sm shadow-green-200"
              >
                Siguiente
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
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-60 transition shadow-sm shadow-green-200"
              >
                {submitting ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>✓ Registrar mascota</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Step counter */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Paso {STEPS.findIndex((s) => s.id === step) + 1} de {STEPS.length}
        </p>
      </div>
    </div>
  );
};
