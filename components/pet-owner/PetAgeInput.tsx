import React, { ChangeEvent, useEffect, useState } from "react";

interface PetAgeInputProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  errorMsg?: string;
  maxLength?: number;
  pattern?: string;
  type?: string;
}

export default function PetAgeInput({
  label,
  value,
  onChange,
  placeholder = "0.1",
  error,
  errorMsg,
  maxLength = 4, // สำหรับอายุ เช่น "10.0" เราตั้ง maxLength เป็น 4 (1 digit + 1 dot + 1 digit + 1 digit)
  pattern,
  type = "tel", // ค่า default สำหรับ type
}: PetAgeInputProps) {
  // ปัญหาที่เจอคือ ตอนรับข้อมูลมาแสดง แล้วข้อมูลที่เป็น string "10.2" ไม่สามารถแสดงใน input ได้
  const [formattedValue, setFormattedValue] = useState<string>("");

  // เมื่อ value เปลี่ยนแปลงจาก props, ให้ทำการอัปเดต formattedValue
  useEffect(() => {
    if (value !== undefined) {
      setFormattedValue(value); // เมื่อค่ามีการเปลี่ยนแปลงจาก props
    }
  }, [value]); // ตรวจสอบการเปลี่ยนแปลงของ value

  const formatAge = (input: string): string => {
    const cleaned = input.replace(/[^0-9.]/g, ""); // ลบตัวอักษรที่ไม่ใช่ตัวเลขหรือจุดทศนิยม

    // จำกัดความยาวตาม maxLength
    if (cleaned.length > maxLength) {
      return cleaned.slice(0, maxLength);
    }

    const dotCount = (cleaned.match(/\./g) || []).length;
    if (dotCount > 1) {
      return cleaned.slice(0, cleaned.lastIndexOf(".")); // ลบจุดที่เกิน
    }

    const [integerPart, decimalPart] = cleaned.split(".");
    if (decimalPart && decimalPart.length > 1) {
      return `${integerPart}.${decimalPart.slice(0, 1)}`;
    }

    return cleaned; // คืนค่าที่ฟอร์แมตแล้ว
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedAge = formatAge(inputValue); // ฟอร์แมตค่าก่อนเก็บใน state

    setFormattedValue(formattedAge); // เก็บค่าใน state ที่เป็น string
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
          type={type}
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
