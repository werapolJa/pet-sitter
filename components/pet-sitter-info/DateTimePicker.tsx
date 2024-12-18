import React, { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";

interface DatePickerProps {
  label: string;
  value: string | null;
  onChange: (date: string | null) => void;
  placeholder?: string;
  error?: boolean; // Added error
  errorMsg?: string; // Added errorMsg
}
//work
const DateAndTimePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = "Select a date for your booking",
}) => {
  const [open, setOpen] = useState(false); // Track the calendar open state
  const parsedDate = value ? dayjs(value) : null;

  const handleDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      onChange(newValue.format("YYYY-MM-DD"));
    } else {
      onChange(null);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <label className="form-control w-full" onClick={() => setOpen(true)}>
        <div className="label">
          <span className="label-text text-base font-medium">{label}</span>
        </div>
        <div
          className={`input flex items-center gap-2 input-bordered focus-within:outline-none focus-within:border-orange-500`}
        >
          <DatePicker
            value={parsedDate}
            onChange={handleDateChange}
            format="DD MMM, YYYY"
            minDate={dayjs()} // Allow only future dates
            shouldDisableDate={(date) => date.isBefore(dayjs(), "day")} // Disable past dates
            open={open} // Open the calendar programmatically
            onClose={() => setOpen(false)} // Close the calendar when it loses focus
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "standard",
                placeholder,
                InputProps: {
                  disableUnderline: true,
                  className: "grow focus:outline-none px-2 py-1 text-base",
                  onClick: () => setOpen(true), // Open calendar on input click
                  endAdornment: null,
                },
              },
              popper: {
                sx: {
                  "& .MuiPaper-root": {
                    borderRadius: "12px",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                  },
                },
              },
              day: {
                sx: {
                  fontSize: "14px",
                  "&.MuiPickersDay-today": {
                    borderRadius: "50%",
                    border: "1px solid #FF7037", // Highlight today’s date
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
            }}
          />
        </div>
      </label>
    </LocalizationProvider>
  );
};

export default DateAndTimePicker;
