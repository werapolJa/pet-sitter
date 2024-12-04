import React, { useState, ChangeEvent } from "react";

interface IdCardInputProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  errorMsg?: string;
  maxLength?: number;
  pattern?: string;
  type?: string; // New prop for input type
}

export default function IdCardInput({
  label,
  value,
  onChange,
  placeholder,
  error,
  errorMsg,
  maxLength = 16,
  pattern,
  type = "text", // Default value for type
}: IdCardInputProps) {
  const [formattedValue, setFormattedValue] = useState(
    formatIdCard(value || "")
  );

  function formatIdCard(input: string): string {
    const cleaned = input.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{4})(\d{2})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }
    return cleaned;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedNumber = formatIdCard(inputValue);
    setFormattedValue(formattedNumber);

    // Remove spaces before sending to parent component
    const unformattedNumber = formattedNumber.replace(/\s/g, "");
    if (onChange) {
      onChange(unformattedNumber);
    }
  };

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
          type={type} // Apply the type prop here
          placeholder={error ? "Please fill out this field" : placeholder}
          className={`grow focus:outline-none px-2 py-1 ${
            error ? "" : "focus:border-transparent"
          }`}
          value={formattedValue}
          onChange={handleChange}
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
