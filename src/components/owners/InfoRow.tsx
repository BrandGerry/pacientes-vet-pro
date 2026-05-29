export const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 shrink-0 w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
      {icon}
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium leading-none mb-0.5">
        {label}
      </p>
      <p className="text-sm text-gray-700">{value}</p>
    </div>
  </div>
);
