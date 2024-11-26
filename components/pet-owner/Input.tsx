import { ChangeEvent } from "react";

interface InputProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error: boolean;
}

export default function Input({ label, type, value, onChange, placeholder, error }: InputProps) {
  return (
    <label className={`form-control`}>
      <div className="label">
        <span className="label-text text-base font-medium">{label}</span>
      </div>
      {!error ? (
        <input
          type={type}
          placeholder={placeholder}
          className="input input-bordered focus:border-orange-500 focus:outline-orange-500"
          value={value}
          onChange={onChange}
        />
      ) : (
        <div className="input input-bordered input-error flex items-center gap-2">
          <input
            type={type}
            className="grow"
            placeholder="Please fill out this field"
            value={value} 
            onChange={onChange} 
          />
          <span className="badge text-xl text-white" style={{ backgroundColor: 'red', borderRadius: '50%', width: '25px', height: '25px' }}>!</span>
        </div>
      )}
    </label>
  );
}

