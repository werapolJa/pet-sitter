import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface BirthDatePickerProps {
  // You can define additional props here if needed
}

const BirthDatePicker: React.FC<BirthDatePickerProps> = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isValid, setIsValid] = useState<boolean>(true); // To track if age is valid

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);

      // Age validation: Ensure user is at least 18 years old
      const age = new Date().getFullYear() - date.getFullYear();
      setIsValid(age >= 18);
    }
  };

  return (
    <div className="w-full md:w-1/2 relative">
      <label className="block text-base font-medium">Date of Birth</label>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="MM/dd/yyyy"
        maxDate={new Date()}
        className="input input-bordered w-full px-4 py-2"
        placeholderText="Select Date"
      />
      {!isValid && (
        <span className="text-red-500 text-sm">
          You must be at least 18 years old
        </span>
      )}
    </div>
  );
};

export default BirthDatePicker;
