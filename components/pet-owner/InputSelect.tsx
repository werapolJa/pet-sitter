import { ChangeEvent } from "react";

interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  options: { value: string; label: string }[]; // ตัวเลือกใน select
  error?: boolean;
  errorMsg?: string;
}

export default function Select({
  label,
  value,
  onChange,
  placeholder,
  options,
  error,
  errorMsg,
}: SelectProps) {
  return (
    <label className="form-control">
      <div className="label">
        <span className="label-text text-base font-medium">{label}</span>
        {error && errorMsg && (
          <p className="text-red-500 text-sm mt-1 text-right">{errorMsg}</p>
        )}
      </div>
      <div
        className={`input flex items-center  input-bordered  px-0 focus-within:outline-none `}
      >
        <select
          className={`select  w-full input-bordered focus-within:outline-none pl-4 rounded-lg py-0 focus-within:border-orange-500 ${
            error ? "text-red-500 border-red-500" : "text-black"
          }`}
          value={value}
          onChange={onChange}
        >
          <option value="" disabled>
            {placeholder || "Select an option"}
          </option>

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-black w-full h-full "
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}
