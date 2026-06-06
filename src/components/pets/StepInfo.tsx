import { PetFormData } from "../../pages/pets/PetsForm";
import { ErrorMsg } from "./ErrorMsj";
import { Label } from "./Label";

const SPECIES = [
  "perro",
  "gato",
  "pajaro",
  "conejo",
  "hamster",
  "pez",
  "reptil",
  "otro",
];

const SPECIES_LABELS: Record<string, string> = {
  perro: "🐶 Perro",
  gato: "🐱 Gato",
  pajaro: "🐦 Ave",
  conejo: "🐰 Conejo",
  hamster: "🐹 Hámster",
  pez: "🐠 Pez",
  reptil: "🦎 Reptil",
  otro: "🐾 Otro",
};

const BLOOD_TYPES = [
  "DEA 1.1+",
  "DEA 1.1-",
  "DEA 1.2+",
  "DEA 1.2-",
  "A",
  "B",
  "AB",
  "Desconocido",
];

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-green-200 bg-white text-sm text-gray-700 placeholder-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition";

const selectCls = `${inputCls} cursor-pointer`;

export const StepInfo: React.FC<{
  data: PetFormData;
  errors: Partial<Record<keyof PetFormData, string>>;
  onChange: (field: keyof PetFormData, value: unknown) => void;
}> = ({ data, errors, onChange }) => (
  <div className="space-y-5">
    {/* Owner */}
    <div>
      <Label required>Propietario</Label>
      <input
        type="text"
        placeholder="Ej.Brandon Mercado"
        value={data.owner_id}
        onChange={(e) => onChange("owner_id", e.target.value)}
        className={inputCls}
      />
      <ErrorMsg msg={errors.owner_id} />
    </div>

    {/* Name + Species */}
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <Label required>Nombre</Label>
        <input
          type="text"
          placeholder="Ej. Luna"
          value={data.name}
          onChange={(e) => onChange("name", e.target.value)}
          className={inputCls}
        />
        <ErrorMsg msg={errors.name} />
      </div>
      <div>
        <Label required>Especie</Label>
        <select
          value={data.specie}
          onChange={(e) => onChange("specie", e.target.value)}
          className={selectCls}
        >
          <option value="">Seleccionar...</option>
          {SPECIES.map((s) => (
            <option key={s} value={s}>
              {SPECIES_LABELS[s]}
            </option>
          ))}
        </select>
        <ErrorMsg msg={errors.specie} />
      </div>
    </div>

    {/* Breed + Color */}
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <Label>Raza</Label>
        <input
          type="text"
          placeholder="Ej. Golden Retriever"
          value={data.breed}
          onChange={(e) => onChange("breed", e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <Label>Color</Label>
        <input
          type="text"
          placeholder="Ej. Dorado"
          value={data.color}
          onChange={(e) => onChange("color", e.target.value)}
          className={inputCls}
        />
      </div>
    </div>

    {/* Sex + Birth date */}
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <Label required>Sexo</Label>
        <select
          value={data.sex}
          onChange={(e) => onChange("sex", e.target.value)}
          className={selectCls}
        >
          <option value="">Seleccionar...</option>
          <option value="macho">♂ Macho</option>
          <option value="hembra">♀ Hembra</option>
        </select>
        <ErrorMsg msg={errors.sex} />
      </div>
      <div>
        <Label required>Fecha de nacimiento</Label>
        <input
          type="date"
          value={data.birth_date}
          onChange={(e) => onChange("birth_date", e.target.value)}
          className={inputCls}
          max={new Date().toISOString().split("T")[0]}
        />
        <ErrorMsg msg={errors.birth_date} />
      </div>
    </div>

    {/* Weight + Blood type */}
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <Label>Peso (kg)</Label>
        <input
          type="number"
          step="0.1"
          min="0"
          placeholder="Ej. 28.5"
          value={data.weight}
          onChange={(e) => onChange("weight", e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <Label>Tipo de sangre</Label>
        <select
          value={data.blood_type}
          onChange={(e) => onChange("blood_type", e.target.value)}
          className={selectCls}
        >
          <option value="">Seleccionar...</option>
          {BLOOD_TYPES.map((blood) => (
            <option key={blood} value={blood}>
              {blood}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Sterilized */}
    <div>
      <button
        type="button"
        onClick={() => onChange("sterilized", !data.sterilized)}
        className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl border-2 w-full transition-all duration-150 ${
          data.sterilized
            ? "border-green-400 bg-green-50"
            : "border-gray-200 bg-white"
        }`}
      >
        <div
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
            data.sterilized
              ? "bg-green-500 border-green-500"
              : "border-gray-300"
          }`}
        >
          {data.sterilized && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <div className="text-left">
          <p
            className={`text-sm font-semibold ${
              data.sterilized ? "text-green-700" : "text-gray-600"
            }`}
          >
            Esterilizado/a
          </p>
          <p className="text-xs text-gray-400">
            La mascota ha sido esterilizada o castrada
          </p>
        </div>
      </button>
    </div>
  </div>
);
