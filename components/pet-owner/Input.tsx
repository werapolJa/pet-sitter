import { ChangeEvent } from "react";

interface InputProps {
  label?: string;
  type?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: boolean;
  errorMsg?: string;
  maxLength?: number;
  pattern?: string;
}

export default function Input({
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
  errorMsg,
  maxLength,
  pattern,
}: InputProps) {
  return (
    <label className="form-control">
      <div className="label">
        <span className="label-text text-base font-medium">{label}</span>
        {error && errorMsg && (
          <p className="text-red-500 text-sm mt-1 text-right">{errorMsg}</p>
        )}
      </div>
      <div
        className={`input flex items-center gap-2 ${
          error
            ? "input-error border-red-500 focus-within:outline-none"
            : "input-bordered focus-within:outline-none focus-within:border-orange-500"
        }`}
      >
        <input
          type={type}
          placeholder={error ? "Please fill out this field" : placeholder}
          className={`grow focus:outline-none px-2 py-1 ${
            error ? "" : "focus:border-transparent"
          }`}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          pattern={pattern}
        />
        {error && (
          <span
            className="badge text-xl text-white flex-shrink-0"
            style={{
              backgroundColor: "red",
              borderRadius: "50%",
              width: "25px",
              height: "25px",
            }}
          >
            !
          </span>
        )}
      </div>
    </label>
  );
}
