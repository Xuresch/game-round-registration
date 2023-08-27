import React from "react";
import Dropdown from "../shared/intput/dropdown";

function TimeSlotSelector({ timeSlots, selectedTimeSlot, onSelectTimeSlot }) {

    console.log("timeSlots", timeSlots);
    console.log("selectedTimeSlot", selectedTimeSlot);
  return (
    <Dropdown
      label="Time Slot"
      options={timeSlots}
      value={selectedTimeSlot}
      onChange={onSelectTimeSlot}
    />
  );
}

export default TimeSlotSelector;
