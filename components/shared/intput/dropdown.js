import React from "react";
import FormGroupe from "./formGroupe";

import styles from "./Dropdown.module.css";

function Dropdown({ label, options, value, onChange }) {
//   console.log("Dropdown:");
//   console.log("label: ", label);
//   console.log("options: ", options);
//   console.log("value: ", value);
//   console.log("onChange: ", onChange);

  return (
    <FormGroupe label={label}>
      <select value={value} onChange={onChange} className={styles.select}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormGroupe>
  );
}

export default Dropdown;
