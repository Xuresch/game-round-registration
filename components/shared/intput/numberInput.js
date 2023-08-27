import React from "react";
import FormGroupe from "./formGroupe";

import styles from "./NumberInput.module.css";

function NumberInput({ label, value, onChange }) {
  return (
    <FormGroupe label={label}>
      <input
        type="number"
        value={value}
        onChange={onChange}
        className={styles.input}
      />
    </FormGroupe>
  );
}

export default NumberInput;
