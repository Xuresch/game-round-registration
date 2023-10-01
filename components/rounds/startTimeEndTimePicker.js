import React from "react";
import DateTimePicker from "../shared/intput/dateTimePicker";
import styles from "./StartTimeEndTimePicker.module.css";

function StartTimeEndTimePicker({
  startTime,
  endTime,
  onSelectStartTime,
  onSelectEndTime,
}) {
  return (
    <div className={styles.container}>
      <DateTimePicker
        label="Start Datum und Zeit"
        value={startTime}
        onChange={onSelectStartTime}
      />
      <DateTimePicker
        label="End Datum und Zeit"
        value={endTime}
        onChange={onSelectEndTime}
      />
    </div>
  );
}

export default StartTimeEndTimePicker;
