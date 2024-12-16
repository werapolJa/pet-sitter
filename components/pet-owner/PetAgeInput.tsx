import React, { useState, ChangeEvent } from "react";

interface AgeInputProps {
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

export default function AgeInput({
  label,
  value,
  onChange,
  placeholder = "0.1",
  error,
  errorMsg,
  maxLength = 4, // For age like "10.0", we set maxLength to 4 (1 digit + 1 dot + 1 digit + 1 digit)
  pattern,
  type = "tel", // Default value for type
}: AgeInputProps) {
  const [formattedValue, setFormattedValue] = useState(
    formatAge(value || "")
  );

  // ฟังก์ชันในการตรวจสอบและฟอร์แมตอายุ
  function formatAge(input: string): string {
    const cleaned = input.replace(/[^0-9.]/g, ""); // ลบตัวอักษรที่ไม่ใช่ตัวเลขหรือจุดทศนิยม
  
    // ตรวจสอบว่ามีจุดทศนิยมมากกว่า 1 จุดหรือไม่
    const dotCount = (cleaned.match(/\./g) || []).length;
    if (dotCount > 1) {
      return cleaned.slice(0, cleaned.lastIndexOf(".")); // ลบจุดที่เกิน
    }
  
    // จำกัดให้ทศนิยมมีได้แค่ 1 ตำแหน่ง
    const [integerPart, decimalPart] = cleaned.split(".");
    if (decimalPart && decimalPart.length > 1) {
      return `${integerPart}.${decimalPart.slice(0, 1)}`; // ตัดทศนิยมเหลือ 1 ตำแหน่ง
    }
  
    return cleaned; // คืนค่าที่ฟอร์แมตแล้ว
  }
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedAge = formatAge(inputValue); // ฟอร์แมตค่าใหม่ตามเงื่อนไข
  
    setFormattedValue(formattedAge); // อัปเดตค่าที่จะแสดงในฟิลด์อินพุต
  
    if (onChange) {
      onChange(formattedAge); // ส่งค่าที่ฟอร์แมตแล้วให้ parent component
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
