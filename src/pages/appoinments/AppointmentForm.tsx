import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePetsStore } from "../../store/usePetsStore";
import { registerAppointmen } from "../../services/registerAppointment";
import { useAppointmentStore } from "../../store/useAppointmentStore";

// ── Types ──────────────────────────────────────────────────────────────────
export interface Appointments {
  id?: string;
  created_at?: string;
  pet_id: string;
  veterinarian_id: string;
  date: string; // ISO completo: "2026-06-10T10:30:00"
  reason: string;
  status: string;
  date_end: string; // ISO completo
}

interface FormState {
  owner_id: string; // solo para filtrar mascotas en UI, no va al payload
  pet_id: string;
  veterinarian_id: string;
  date: string; // "YYYY-MM-DD"
  time_start: string; // "HH:MM"
  time_end: string; // "HH:MM"
  reason: string;
  status: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const SPECIES_EMOJI: Record<string, string> = {
  perro: "🐶",
  gato: "🐱",
  pajaro: "🐦",
  conejo: "🐰",
  hamster: "🐹",
  pez: "🐠",
  reptil: "🦎",
  dog: "🐶",
  cat: "🐱",
  bird: "🐦",
  rabbit: "🐰",
  fish: "🐠",
  reptile: "🦎",
};
const getEmoji = (s: string) => SPECIES_EMOJI[s?.toLowerCase()] ?? "🐾";

const REASON_PRESETS = [
  "Revisión anual",
  "Vacunación",
  "Consulta por enfermedad",
  "Desparasitación",
  "Limpieza dental",
  "Control de peso",
  "Cirugía / procedimiento",
  "Urgencia",
  "Seguimiento de tratamiento",
];

// veterinarian_id puede ser el ID real de tu tabla de veterinarios.
// Por ahora usamos opciones fijas — reemplaza con tu store de vets si lo tienes.
const VETS = [
  { id: "vet-1", name: "Dr. Ramírez" },
  { id: "vet-2", name: "Dra. López" },
  { id: "vet-3", name: "Dr. Sánchez" },
  { id: "vet-4", name: "Dra. Martínez" },
];

const todayISO = () => new Date().toISOString().split("T")[0];

const toISO = (date: string, time: string) =>
  date && time ? `${date}T${time}:00` : "";

const INITIAL: FormState = {
  owner_id: "",
  pet_id: "",
  veterinarian_id: "",
  date: "",
  time_start: "",
  time_end: "",
  reason: "",
  status: "scheduled",
};

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
  msg ? (
    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
      <span>⚠</span>
      {msg}
    </p>
  ) : null;

// ── Main Component ─────────────────────────────────────────────────────────
export const AppointmentForm: React.FC = () => {
  const navigate = useNavigate();
  const pets = usePetsStore((s) => s.pets);
  const fetchAppointments = useAppointmentStore((s) => s.fetchAppointments);

  // Derivar lista única de owners desde el store
  const owners = useMemo(
    () =>
      (pets ?? []).map((o: any) => ({
        id: o.id as string,
        name: o.name as string,
      })),
    [pets]
  );

  // ── State ────────────────────────────────────────────────────────────────
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Mascotas del owner seleccionado
  const availablePets = useMemo(() => {
    if (!form.owner_id) return [];
    const owner = (pets ?? []).find((o: any) => o.id === form.owner_id);
    return (owner?.pets ?? []) as {
      id: string;
      name: string;
      specie: string;
    }[];
  }, [pets, form.owner_id]);

  const selectedOwner = owners.find((o) => o.id === form.owner_id);
  const selectedPet = availablePets.find((p) => p.id === form.pet_id);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const set = (field: keyof FormState, value: string) => {
    setForm((f) => {
      if (field === "owner_id") return { ...f, owner_id: value, pet_id: "" };
      return { ...f, [field]: value };
    });
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.owner_id) e.owner_id = "Selecciona un propietario";
    if (!form.pet_id) e.pet_id = "Selecciona una mascota";
    if (!form.date) e.date = "Indica la fecha";
    else if (form.date < todayISO())
      e.date = "La fecha no puede ser en el pasado";
    if (!form.time_start) e.time_start = "Indica la hora de inicio";
    if (!form.time_end) e.time_end = "Indica la hora de fin";
    else if (form.time_start && form.time_end <= form.time_start)
      e.time_end = "La hora de fin debe ser después de la de inicio";
    if (!form.reason.trim()) e.reason = "El motivo es obligatorio";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setSubmitting(true);
      const payload: Partial<Appointments> = {
        pet_id: form.pet_id,
        date: toISO(form.date, form.time_start),
        date_end: toISO(form.date, form.time_end),
        reason: form.reason,
      };
      await registerAppointmen(payload);
      setSuccess(true);
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      setSubmitting(false);
      fetchAppointments();
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-10 max-w-sm w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mx-auto">
            📅
          </div>
          <h2 className="text-xl font-bold text-gray-800">¡Cita agendada!</h2>
          <div className="bg-green-50 rounded-xl border border-green-100 p-4 text-left space-y-2">
            {selectedPet && (
              <p className="text-sm font-semibold text-gray-700">
                {getEmoji(selectedPet.specie)} {selectedPet.name}
                {selectedOwner && (
                  <span className="font-normal text-gray-500">
                    {" "}
                    · {selectedOwner.name}
                  </span>
                )}
              </p>
            )}
            <p className="text-sm text-gray-500">
              📅{" "}
              {new Date(form.date + "T00:00:00").toLocaleDateString("es-MX", {
                weekday: "long",
                day: "2-digit",
                month: "long",
              })}
              {" · "}
              {form.time_start} – {form.time_end}
            </p>
            <p className="text-sm text-gray-500">🩺 {form.reason}</p>
            {form.veterinarian_id && (
              <p className="text-sm text-gray-500">
                👨‍⚕️{" "}
                {VETS.find((v) => v.id === form.veterinarian_id)?.name ??
                  form.veterinarian_id}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={() => navigate("/appointments")}
              className="w-full py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition shadow-sm shadow-green-200"
            >
              Ver todas las citas
            </button>
            <button
              onClick={() => {
                setForm(INITIAL);
                setSuccess(false);
              }}
              className="w-full py-2.5 rounded-xl border border-green-200 text-green-700 text-sm font-semibold hover:bg-green-50 transition"
            >
              Agendar otra cita
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      <div className="max-w-5xl mx-auto">
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
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Nueva cita
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Agenda una cita para una mascota
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm divide-y divide-green-50">
          {/* ── Sección 1: Paciente ──────────────────────────────────── */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center text-sm">
                🐾
              </div>
              <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                Paciente
              </h2>
            </div>

            {/* Owner select */}
            <div>
              <Label required>Propietario</Label>
              <select
                value={form.owner_id}
                onChange={(e) => set("owner_id", e.target.value)}
                className={selectCls}
              >
                <option value="">Seleccionar propietario...</option>
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
              <ErrorMsg msg={errors.owner_id} />
            </div>

            {/* Pet select */}
            <div>
              <Label required>Mascota</Label>
              {!form.owner_id ? (
                <div className="w-full px-3.5 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-400 select-none">
                  Primero selecciona un propietario
                </div>
              ) : availablePets.length === 0 ? (
                <div className="w-full px-3.5 py-2.5 rounded-xl border border-amber-100 bg-amber-50 text-sm text-amber-600">
                  Este propietario no tiene mascotas registradas
                </div>
              ) : (
                <select
                  value={form.pet_id}
                  onChange={(e) => set("pet_id", e.target.value)}
                  className={selectCls}
                >
                  <option value="">Seleccionar mascota...</option>
                  {availablePets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {getEmoji(p.specie)} {p.name}
                    </option>
                  ))}
                </select>
              )}
              <ErrorMsg msg={errors.pet_id} />
            </div>

            {/* Preview mascota seleccionada */}
            {selectedPet && (
              <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-green-50 border border-green-100">
                <span className="text-2xl">{getEmoji(selectedPet.specie)}</span>
                <div>
                  <p className="text-sm font-semibold text-green-800">
                    {selectedPet.name}
                  </p>
                  <p className="text-xs text-green-600 capitalize">
                    {selectedPet.specie} · {selectedOwner?.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Sección 2: Fecha y hora ──────────────────────────────── */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center text-sm">
                📅
              </div>
              <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                Fecha y hora
              </h2>
            </div>

            {/* Date */}
            <div>
              <Label required>Fecha</Label>
              <input
                type="date"
                value={form.date}
                min={todayISO()}
                onChange={(e) => set("date", e.target.value)}
                className={inputCls}
              />
              <ErrorMsg msg={errors.date} />
            </div>

            {/* Start / End time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label required>Hora inicio</Label>
                <input
                  type="time"
                  value={form.time_start}
                  onChange={(e) => set("time_start", e.target.value)}
                  className={inputCls}
                />
                <ErrorMsg msg={errors.time_start} />
              </div>
              <div>
                <Label required>Hora fin</Label>
                <input
                  type="time"
                  value={form.time_end}
                  onChange={(e) => set("time_end", e.target.value)}
                  className={inputCls}
                />
                <ErrorMsg msg={errors.time_end} />
              </div>
            </div>

            {/* Duration preview */}
            {form.time_start &&
              form.time_end &&
              form.time_end > form.time_start && (
                <p className="text-xs text-green-600 bg-green-50 border border-green-100 px-3 py-1.5 rounded-lg">
                  ⏱ Duración:{" "}
                  {(() => {
                    const [sh, sm] = form.time_start.split(":").map(Number);
                    const [eh, em] = form.time_end.split(":").map(Number);
                    const mins = eh * 60 + em - (sh * 60 + sm);
                    return mins >= 60
                      ? `${Math.floor(mins / 60)}h ${
                          mins % 60 > 0 ? `${mins % 60}min` : ""
                        }`
                      : `${mins} min`;
                  })()}
                </p>
              )}
          </div>

          {/* ── Sección 3: Consulta ──────────────────────────────────── */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center text-sm">
                🩺
              </div>
              <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                Consulta
              </h2>
            </div>

            {/* Reason presets */}
            <div>
              <Label required>Motivo</Label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {REASON_PRESETS.map((rsn) => (
                  <button
                    key={rsn}
                    type="button"
                    onClick={() => set("reason", rsn)}
                    className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-all ${
                      form.reason === rsn
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-500 border-gray-200 hover:border-green-300 hover:text-green-700"
                    }`}
                  >
                    {rsn}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="O escribe un motivo personalizado..."
                value={form.reason}
                onChange={(e) => set("reason", e.target.value)}
                className={inputCls}
              />
              <ErrorMsg msg={errors.reason} />
            </div>
          </div>

          {/* ── Footer ───────────────────────────────────────────────── */}
          <div className="p-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:border-green-300 hover:text-green-700 transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-60 transition shadow-sm shadow-green-200"
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
                "📅 Agendar cita"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
