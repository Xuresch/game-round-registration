import React from "react";
import FormGroupe from "./formGroupe";

import styles from "./TextInput.module.css";

function TextInput({ label, value, onChange, readOnly = false, disable = false }) {
  return (
    <FormGroupe label={label}>
      <input
        className={styles.input}
        type="text"
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        disabled={disable}
      />
    </FormGroupe>
  );
}

export default TextInput;
