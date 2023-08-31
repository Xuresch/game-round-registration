import React from "react";
import FormGroupe from "./formGroupe";

import styles from "./TextInput.module.css";

function TextInput({
  label,
  value,
  onChange,
  readOnly = false,
  disable = false,
  error,
}) {
  return (
    <FormGroupe label={label}>
      <input
        className={`${styles.input} ${error ? styles.error : ""}`}
        type="text"
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        disabled={disable}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </FormGroupe>
  );
}

export default TextInput;
