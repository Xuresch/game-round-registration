import React from "react";
import styles from "./FormGroupe.module.css";

function FormGroupe({ children, label, error }) {
  return (
    <div className={styles.formGroup}>
      <label>
        <b>{label}:</b>
        {children}
      </label>
    </div>
  );
}

export default FormGroupe;
