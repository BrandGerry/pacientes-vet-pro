import { Step } from "../pages/pets/PetsForm";

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const formatDateLong = (iso: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const isOverdue = (date: string | null) =>
  !!date && new Date(date) < new Date();

export const calcAge = (birthDate: string) => {
  const diff = Date.now() - new Date(birthDate).getTime();
  const years = Math.floor(diff / (365.25 * 24 * 3600 * 1000));
  const months = Math.floor(
    (diff % (365.25 * 24 * 3600 * 1000)) / (30.44 * 24 * 3600 * 1000)
  );
  if (years === 0) return `${months} mes${months !== 1 ? "es" : ""}`;
  return `${years} año${years !== 1 ? "s" : ""}${
    months > 0 ? ` ${months}m` : ""
  }`;
};

export const daysSince = (iso: string) =>
  Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);

export const SPECIES_CONFIG: Record<
  string,
  { emoji: string; label: string; bg: string; text: string; border: string }
> = {
  all: {
    emoji: "🐾",
    label: "Todos",
    bg: "bg-green-600",
    text: "text-white",
    border: "border-green-600",
  },
  perro: {
    emoji: "🐶",
    label: "Perros",
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-300",
  },
  gato: {
    emoji: "🐱",
    label: "Gatos",
    bg: "bg-stone-100",
    text: "text-stone-700",
    border: "border-stone-300",
  },
  pajaro: {
    emoji: "🐦",
    label: "Aves",
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-300",
  },
  conejo: {
    emoji: "🐰",
    label: "Conejos",
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-300",
  },
  hamster: {
    emoji: "🐹",
    label: "Hamsters",
    bg: "bg-pink-100",
    text: "text-pink-700",
    border: "border-pink-300",
  },
  pez: {
    emoji: "🐠",
    label: "Peces",
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-300",
  },
  reptil: {
    emoji: "🦎",
    label: "Reptiles",
    bg: "bg-lime-100",
    text: "text-lime-700",
    border: "border-lime-300",
  },
};

export const SPECIES_CONFIG_IND: Record<
  string,
  { emoji: string; bg: string; text: string }
> = {
  perro: {
    emoji: "🐶",
    bg: "from-amber-100 to-amber-50",
    text: "text-amber-800",
  },
  gato: {
    emoji: "🐱",
    bg: "from-stone-100 to-stone-50",
    text: "text-stone-700",
  },
  pajaro: {
    emoji: "🐦",
    bg: "from-yellow-100 to-yellow-50",
    text: "text-yellow-800",
  },
  conejo: {
    emoji: "🐰",
    bg: "from-orange-100 to-orange-50",
    text: "text-orange-700",
  },
  hamster: {
    emoji: "🐹",
    bg: "from-pink-100 to-pink-50",
    text: "text-pink-700",
  },
  pez: { emoji: "🐠", bg: "from-blue-100 to-blue-50", text: "text-blue-700" },
  reptil: {
    emoji: "🦎",
    bg: "from-lime-100 to-lime-50",
    text: "text-lime-700",
  },
};

export const STEPS: { id: Step; label: string; emoji: string }[] = [
  { id: "user", label: "Datos del Propietario", emoji: "🙋🏻‍♂️" },
  { id: "info", label: "Datos de la mascota", emoji: "🐾" },
  { id: "medical", label: "Consulta inicial", emoji: "🩺" },
  { id: "vaccines", label: "Vacunas", emoji: "💉" },
];
