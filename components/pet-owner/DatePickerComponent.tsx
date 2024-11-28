import React, { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";

interface DatePickerProps {
  label: string;
  value: string | null;
  onChange: (date: string | null) => void;
  error: boolean;
  placeholder?: string;
}

const DatePickerComponent: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder = "Select your birth date",
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
      <div className="w-full">
        <label
          htmlFor="birthdate"
          className="block text-base font-medium mb-2 mt-2"
        >
          {label}
        </label>
        <div className="relative">
          <DatePicker
            value={parsedDate}
            onChange={handleDateChange}
            format="D MMM YYYY"
            slots={{
              openPickerButton: (props) => (
                <button
                  {...props}
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center"
                >
                  <img
                    src="/assets/date-picker-icon.svg"
                    alt="Calendar Icon"
                    className="w-6 h-6"
                  />
                </button>
              ),
            }}
            slotProps={{
              day: {
                sx: {
                  // Style for today's date
                  "&.MuiPickersDay-today": {
                    backgroundColor: "#FF7037", // Orange background for today
                    color: "#FFFFFF", // White text for today
                    borderRadius: "50%", // Ensures it's circular
                    border: "2px solid #FF7037",
                  },
                  "&.MuiPickersDay-today:hover": {
                    backgroundColor: "#E0602F", // Darker orange on hover
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
                variant: "outlined",
                error: error || internalError,
                className: `w-full h-[48px] ${
                  error || internalError ? "border-red-500" : "border-slate-200"
                }`,
                placeholder: placeholder,
                inputProps: {
                  className: "w-full h-full px-4 py-4 text-base",
                  style: {
                    height: "16px",
                    fontSize: "16px",
                    borderRadius: "8px",
                  },
                },
              },
            }}
          />
        </div>
        {(error || internalError) && (
          <span className="text-red-500 text-sm mt-1">
            Please select a valid date. Birthdate cannot be in the future.
          </span>
        )}
      </div>
    </LocalizationProvider>
  );
};

export default DatePickerComponent;
