export const SectionTitle: React.FC<{
  icon: React.ReactNode;
  title: string;
  count?: number;
}> = ({ icon, title, count }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
      {icon}
    </div>
    <h2 className="font-bold text-gray-700 text-base">{title}</h2>
    {count !== undefined && (
      <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-600 border border-green-200 font-semibold">
        {count}
      </span>
    )}
  </div>
);
