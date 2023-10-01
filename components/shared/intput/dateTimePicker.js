import React from "react";
import style from "./DateTimePicker.module.css";

function DateTimePicker({ label, value, onChange }) {
  return (
    <div className={style.datetimePicker}>
      <label>
        <b>{label}:</b>
      </label>
      <input type="datetime-local" value={value} onChange={onChange} />
    </div>
  );
}

export default DateTimePicker;
