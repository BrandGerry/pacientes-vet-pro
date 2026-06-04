import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StepBar } from "../../components/pets/StepBar";
import { STEPS } from "../../helpers/dataOfPets";
import { StepInfo } from "../../components/pets/StepInfo";
import { Label } from "../../components/pets/Label";
import { ErrorMsg } from "../../components/pets/ErrorMsj";
import { StepMedical } from "../../components/pets/StepMedical";
import { StepVaccines } from "../../components/pets/StepVaccines";
import { Owners } from "../../store/usePetsStore";

// ── Types ──────────────────────────────────────────────────────────────────
export interface PetFormData {
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

export interface VaccineFormData {
  _key: number;
  vaccine_name: string;
  aplication_date: string;
  next_dose_date: string;
  notes: string;
}

export interface MedicalFormData {
  symptoms: string;
  diagnosis: string;
  treatment: string;
  notes: string;
}

// ── Mock owners (reemplaza con tu store) ───────────────────────────────────

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

const INITIAL_OWNERS: Owners = {
  user_id: "cb32acd1-8e1b-457d-af49-d9775e0e8755",
  name: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
  avatar_url: "",
};

// ── Helpers ────────────────────────────────────────────────────────────────
export type Step = "info" | "medical" | "vaccines";

// ── Main Component ─────────────────────────────────────────────────────────
export const PetsForm: React.FC = () => {
  const navigate = useNavigate();
  //ESTADOS
  const [step, setStep] = useState<Step>("info");
  const [completed, setCompleted] = useState<Set<Step>>(new Set());
  const [form, setForm] = useState<PetFormData>(INITIAL);
  const [formOwner, setFormOwner] = useState<Owners>(INITIAL_OWNERS);
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
      <div className="max-w-5xl mx-auto">
        {/* Back ✅ */}
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

        {/* Header ✅*/}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Registrar mascota
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Completa la información de la mascota y su primera consulta
          </p>
        </div>

        {/* Step bar ✅*/}
        <StepBar current={step} completed={completed} />

        {/* Card */}
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6 sm:p-8">
          {/* Step title ✅*/}
          <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-green-50">
            <span className="text-xl">
              {STEPS.find((s) => s.id === step)?.emoji}
            </span>
            <h2 className="font-bold text-gray-700">
              {STEPS.find((s) => s.id === step)?.label}
            </h2>
          </div>

          {/* CONTENIDO */}
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
