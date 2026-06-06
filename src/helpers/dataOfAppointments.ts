export const today = new Date().toISOString().split("T")[0];
export const isToday = (iso: string) => {
  const date = new Date(iso);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};
export const isPast = (iso: string) => {
  const date = new Date(iso);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return date < today;
};

export const getTimeFromDate = (date: string) =>
  new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
