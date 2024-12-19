import React, { useState, useRef, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import Image from "next/image";

import timeIcon from "@/public/assets/pet-sitter-info-page/time.svg";
import calendarIcon from "@/public/assets/pet-sitter-info-page/calendar.svg";

interface DatePickerProps {
  label: string;
  value: string | null;
  onChange: (
    date: string | null,
    startTime: string | null,
    endTime: string | null
  ) => void;
  placeholder?: string;
  error?: boolean;
  errorMsg?: string;
}

const DateAndTimePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = "Pick a date for booking",
  error,
  errorMsg,
}) => {
  const [open, setOpen] = useState(false);
  const parsedDate = value ? dayjs(value, "DD MMM, YYYY") : null;
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(
    null
  );
  const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null);
  const startTimeDropdownRef = useRef<HTMLDivElement>(null);
  const endTimeDropdownRef = useRef<HTMLDivElement>(null);
  const [isStartTimeOpen, setIsStartTimeOpen] = useState(false);
  const [isEndTimeOpen, setIsEndTimeOpen] = useState(false);
  const [isStartTimeFocused, setIsStartTimeFocused] = useState(false);
  const [isEndTimeFocused, setIsEndTimeFocused] = useState(false);

  const handleDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      onChange(
        newValue.format("DD MMM, YYYY"),
        selectedStartTime,
        selectedEndTime
      );
    } else {
      onChange(null, selectedStartTime, selectedEndTime);
    }
  };

  const generateTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = dayjs().hour(hour).minute(minute);
        timeSlots.push({
          display: time.format("h:mm A"),
          value: time.format("HH:mm"),
        });
      }
    }
    // Add the last slot for 23:59
    timeSlots.push({
      display: "11:59 PM",
      value: "23:59",
    });
    return timeSlots;
  };

  const timeSlots = generateTimeSlots();

  const toggleStartTimeDropdown = () => {
    setIsStartTimeOpen((prev) => !prev);
    setIsEndTimeOpen(false);
    setIsStartTimeFocused(true);
    setIsEndTimeFocused(false);
  };

  const toggleEndTimeDropdown = () => {
    setIsEndTimeOpen((prev) => !prev);
    setIsStartTimeOpen(false);
    setIsEndTimeFocused(true);
    setIsStartTimeFocused(false);
  };

  const handleStartTimeSelect = (timeSlot: {
    display: string;
    value: string;
  }) => {
    setSelectedStartTime(timeSlot.value);
    setIsStartTimeOpen(false);
    onChange(
      parsedDate?.format("YYYY-MM-DD") || null,
      timeSlot.value,
      selectedEndTime
    );
    // Reset end time if it's before or equal to the new start time
    if (selectedEndTime && selectedEndTime <= timeSlot.value) {
      setSelectedEndTime(null);
    }
  };

  const handleEndTimeSelect = (timeSlot: {
    display: string;
    value: string;
  }) => {
    setSelectedEndTime(timeSlot.value);
    setIsEndTimeOpen(false);
    onChange(
      parsedDate?.format("YYYY-MM-DD") || null,
      selectedStartTime,
      timeSlot.value
    );
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      startTimeDropdownRef.current &&
      !startTimeDropdownRef.current.contains(event.target as Node) &&
      endTimeDropdownRef.current &&
      !endTimeDropdownRef.current.contains(event.target as Node)
    ) {
      setIsStartTimeOpen(false);
      setIsEndTimeOpen(false);
      setIsStartTimeFocused(false);
      setIsEndTimeFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const getDisplayTime = (time: string | null) => {
    if (!time) return "";
    if (time === "00:00") return "12:00 AM";
    return dayjs(time, "HH:mm").format("h:mm A");
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row items-center mb-3">
        <Image
          src={calendarIcon} // Use a correct relative path
          alt=""
          className="object-cover w-5 h-5 ml-4 mr-4 mt-3"
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <label
            className="form-control w-full mr-4"
            onClick={() => setOpen(true)}
          >
            <div className="label">
              <span className="label-text text-base font-medium">{label}</span>
            </div>
            <div
              className={`input flex items-center gap-2 input-bordered focus-within:outline-none focus-within:border-orange-500 ${
                error ? "border-red-500" : ""
              }`}
            >
              <DatePicker
                value={parsedDate}
                onChange={handleDateChange}
                format="DD MMM, YYYY"
                minDate={dayjs()}
                shouldDisableDate={(date) => date.isBefore(dayjs(), "day")}
                open={open}
                onClose={() => setOpen(false)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "standard",
                    placeholder,
                    InputProps: {
                      disableUnderline: true,
                      className:
                        "grow focus:outline-none py-1 text-base font-normal",
                      onClick: () => setOpen(true),
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
                        border: "1px solid #FF7037",
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
      </div>
      <div className="flex flex-row items-center">
        <Image
          src={timeIcon} // Use a correct relative path
          alt="clock icon"
          className="object-cover w-6 h-6 ml-[15px] mr-[15px]"
        />

        <div className="flex mt-2 w-full items-center">
          <div className="relative w-full" ref={startTimeDropdownRef}>
            <div
              className={`input flex items-center justify-between input-bordered focus-within:outline-none cursor-pointer transition-colors duration-200 ${
                isStartTimeFocused ? "border-orange-500" : ""
              } ${error ? "border-red-500" : ""}`}
              onClick={toggleStartTimeDropdown}
            >
              <span
                className={
                  selectedStartTime
                    ? "text-black text-base"
                    : "text-gray-400 text-sm"
                }
              >
                {getDisplayTime(selectedStartTime) || "Start Time"}
              </span>
            </div>
            {isStartTimeOpen && (
              <div className="scrollbardateandtime absolute z-10 w-full mt-1 bg-white border rounded-md cursor-pointer shadow-lg overflow-auto">
                {timeSlots.map((timeSlot, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleStartTimeSelect(timeSlot)}
                  >
                    {timeSlot.display}
                  </div>
                ))}
              </div>
            )}
          </div>

          <span className="mx-2 text-gray-400">-</span>

          <div className="relative w-full mr-4" ref={endTimeDropdownRef}>
            <div
              className={`input flex items-center justify-between input-bordered focus-within:outline-none cursor-pointer transition-colors duration-200 ${
                isEndTimeFocused ? "border-orange-500" : ""
              } ${error ? "border-red-500" : ""}`}
              onClick={toggleEndTimeDropdown}
            >
              <span
                className={
                  selectedEndTime
                    ? "text-black text-base"
                    : "text-gray-400 text-sm"
                }
              >
                {getDisplayTime(selectedEndTime) || "End Time"}
              </span>
            </div>
            {isEndTimeOpen && (
              <div className="scrollbardateandtime absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {timeSlots
                  .filter(
                    (timeSlot) =>
                      !selectedStartTime || timeSlot.value > selectedStartTime
                  )
                  .map((timeSlot, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleEndTimeSelect(timeSlot)}
                    >
                      {timeSlot.display}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {error && errorMsg && (
        <div className="text-red-500 text-base mt-4 text-center">
          {errorMsg}
        </div>
      )}
    </div>
  );
};

export default DateAndTimePicker;
