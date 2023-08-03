import React from "react";
import moment from "moment";

const DatePickerComponent = ({value, onChange, name, disabled=false, type="date", maxDate}) => {
  return (
    <input
      type={type}
      className="input_datePicker"
      value={value || ""}
      id={name}
      name={name}
      onChange={(e) => onChange(e)}
      disabled={disabled}
      max={maxDate && moment(maxDate).format('YYYY-MM-DD')}
    />
  );
};

export default DatePickerComponent;
