export const ErrorMsg: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? <p className="mt-1 text-xs text-red-500">{msg}</p> : null;
