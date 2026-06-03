export const Chip: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = "bg-green-100 text-green-700 border-green-200",
}) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-medium ${color}`}
  >
    {children}
  </span>
);
