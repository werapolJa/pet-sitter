import React, { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import Image from "next/image";
import datePickericon from "@/public/assets/date-picker-icon.svg";

interface DatePickerProps {
  label: string;
  value: string | null;
  onChange: (date: string | null) => void;
  error: boolean;
  errorMsg?: string;
  placeholder?: string;
}

const DatePickerComponent: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  error,
  errorMsg,
  placeholder = "Select your date of birth ",
}) => {
  const [internalError, setInternalError] = useState(false);
  const parsedDate = value ? dayjs(value) : null;

  const handleDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      setInternalError(false);
      onChange(newValue.format("YYYY-MM-DD"));
    } else {
      setInternalError(false);
      onChange(null);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text text-base font-medium">{label}</span>
          {(error || internalError) && (
            <p className="textleft text-red-500 text-sm mt-2">
              {errorMsg || "Birthdate cannot be in the future."}
            </p>
          )}
          {(error || internalError) && errorMsg && (
            <p className="text-red-500 text-sm mt-1 text-right">{errorMsg}</p>
          )}
        </div>
        <div
          className={`input flex items-center gap-2 ${
            error || internalError
              ? "input-error border-red-500 focus-within:outline-none"
              : "input-bordered focus-within:outline-none focus-within:border-orange-500"
          }`}
        >
          <DatePicker
            value={parsedDate}
            onChange={handleDateChange}
            format="D MMM YYYY"
            slots={{
              openPickerButton: (props) => (
                <button
                  {...props}
                  type="button"
                  className="flex items-center justify-center"
                >
                  <Image
                    src={datePickericon}
                    alt="Calendar Icon"
                    className="w-6 h-6"
                  />
                </button>
              ),
            }}
            slotProps={{
              day: {
                sx: {
                  fontSize: "14px",
                  "&.MuiPickersDay-today": {
                    border: "none",
                  },
                  "&.MuiPickersDay-today:hover": {
                    backgroundColor: "#E0602F",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#FF7037 !important",
                    color: "#FFFFFF !important",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "#E0602F !important",
                  },
                },
              },
              layout: {
                sx: {
                  color: "#FFFFF",
                  borderRadius: "12px",
                  borderWidth: "1px",
                  borderColor: "#2196f3",
                  border: "1px",
                },
              },
              textField: {
                fullWidth: true,
                variant: "standard",
                error: error || internalError,
                placeholder: error ? "Please fill out this field" : placeholder,
                InputProps: {
                  disableUnderline: true,
                  className: "grow focus:outline-none px-2 py-1 text-base",
                },
              },
            }}
          />
          {(error || internalError) && (
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
    </LocalizationProvider>
  );
};

export default DatePickerComponent;
