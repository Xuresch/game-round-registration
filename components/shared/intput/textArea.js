import React from "react";
import FormGroupe from "./formGroupe";

import styles from "./TextArea.module.css";

function TextArea({ label, value, onChange, readOnly = false, error }) {
  return (
    <FormGroupe label={label}>
      <textarea
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`${styles.textarea} ${error ? styles.error : ""}`}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </FormGroupe>
  );
}

export default TextArea;
