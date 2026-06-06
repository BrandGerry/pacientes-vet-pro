import { PetFormData } from "../../pages/pets/PetsForm";
import { Owners } from "../../store/usePetsStore";
import { ErrorMsg } from "./ErrorMsj";
import { Label } from "./Label";

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-green-200 bg-white text-sm text-gray-700 placeholder-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition";

export const StepUser: React.FC<{
  data: Owners;
  errors: Partial<Record<keyof Owners, string>>;
  onChange: (field: keyof Owners, value: unknown) => void;
}> = ({ data, errors, onChange }) => (
  <div className="space-y-5">
    {/* Owner */}
    <div>
      <Label required>Propietario</Label>
      <input
        type="text"
        placeholder="Ej.Brandon Mercado"
        value={data.name}
        onChange={(e) => onChange("name", e.target.value)}
        className={inputCls}
      />
      <ErrorMsg msg={errors.name} />
    </div>

    {/* Email + Phone */}
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <Label required>Email</Label>
        <input
          type="email"
          placeholder="email@gmail.com"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          className={inputCls}
        />
        <ErrorMsg msg={errors.email} />
      </div>
      <div>
        <Label required>Numero</Label>
        <input
          type="tel"
          placeholder="556666666"
          value={data.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          className={inputCls}
        />
        <ErrorMsg msg={errors.phone} />
      </div>
    </div>

    {/* Direccion + Notas */}
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <Label required>Direccion</Label>
        <input
          type="text"
          placeholder="Direccion completa"
          value={data.address}
          onChange={(e) => onChange("address", e.target.value)}
          className={inputCls}
        />
        <ErrorMsg msg={errors.address} />
      </div>
      <div>
        <Label>Notas</Label>
        <input
          type="text"
          placeholder="Ej. Sin reacciones adversas"
          value={data.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          className={inputCls}
        />
      </div>
    </div>
  </div>
);
