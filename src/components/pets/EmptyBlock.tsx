export const EmptyBlock: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-10 rounded-2xl border border-dashed border-green-200 bg-green-50/40 text-center">
    <span className="text-2xl mb-2">🐾</span>
    <p className="text-sm text-gray-400">{message}</p>
  </div>
);
