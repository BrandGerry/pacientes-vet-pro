export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const isOverdue = (nextDue?: string | null) => {
  if (!nextDue) return false;
  return new Date(nextDue) < new Date();
};

export const getPetAge = (birthDate: any) => {
  if (!birthDate) return "—";

  const birth = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return `${age} año${age !== 1 ? "s" : ""}`;
};
