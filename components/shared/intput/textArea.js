import React from "react";
import FormGroupe from "./formGroupe";

import styles from "./TextArea.module.css";

function TextArea({ label, value, onChange, readOnly = false }) {
  return (
    <FormGroupe label={label}>
      <textarea
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={styles.textarea}
      />
    </FormGroupe>
  );
}

export default TextArea;
