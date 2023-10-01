import React from "react";
import styles from "./ButtonGroupComponent.module.css"; // Replace 'YourStylesheet' with your actual stylesheet name

const ButtonGroup = ({ handleCancel, saveButtonText, cancelButtonText }) => {
  return (
    <div className={styles.buttonWrapper}>
      <button className={`${styles.button} ${styles.save}`} type="submit">
        {saveButtonText}
      </button>
      <button
        onClick={handleCancel}
        className={`${styles.button} ${styles.cancel}`}
      >
        {cancelButtonText}
      </button>
    </div>
  );
};

export default ButtonGroup;
