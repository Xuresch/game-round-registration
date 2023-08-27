import React from "react";

import styles from "./Togglebox.module.css";

function Togglebox({ label, checked, onChange }) {
  return (
    <div className={styles.toggleWithLabel}>
      <span className={styles.toggleLabelText}>{label}</span>
      <label className={styles.toggleContainer}>
        <input type="checkbox" checked={checked} onChange={onChange} className={styles.toggleInput} />
        <span className={styles.toggleSlider}></span>
      </label>
    </div>
  );
}

export default Togglebox;
