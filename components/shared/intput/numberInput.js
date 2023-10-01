import React from "react";
import FormGroupe from "./formGroupe";

import styles from "./NumberInput.module.css";

function NumberInput({ label, value, onChange, error }) {
  return (
    <FormGroupe label={label}>
      <input
        type="number"
        value={value}
        onChange={onChange}
        className={`${styles.input} ${error ? styles.error : ""}`}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </FormGroupe>
  );
}

export default NumberInput;
