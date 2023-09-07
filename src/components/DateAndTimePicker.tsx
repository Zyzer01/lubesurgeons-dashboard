import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { setHours, setMinutes } from 'date-fns';

interface DateAndTimePickerProps {
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedDate: string;
  name: string;
}

const DateAndTimePicker: React.FC<DateAndTimePickerProps> = ({
  handleDateChange,
  selectedDate,
  name,
}) => {
  const availableTimes = [];
  for (let hour = 7; hour <= 20; hour++) {
    availableTimes.push(setHours(setMinutes(new Date(), 0), hour));
    availableTimes.push(setHours(setMinutes(new Date(), 30), hour));
  }

  return (
    <DatePicker
      selected={selectedDate}
      onChange={(date) => {
        // Create a synthetic event object to mimic the structure of an input event
        const syntheticEvent = {
          target: {
            name,
            value: date,
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        // Call the parent component's event handler
        handleDateChange(syntheticEvent);
      }}
      showTimeSelect
      dateFormat="MMMM d, yyyy h:mm aa"
      includeTimes={availableTimes}
      className="w-70 sm:w-70 md:w-50 lg:w-60 xl:w-80 placeholder:text-slate-400 placeholder:text-sm bg-white rounded-lg border border-gray-300 focus:border-primary focus:ring-amber-300 text-base outline-none text-gray-700 py-1.5 px-3 leading-8 transition-colors duration-200 ease-in-out"
    />
  );
};

export default DateAndTimePicker;
