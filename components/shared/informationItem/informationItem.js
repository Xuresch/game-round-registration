import React from "react";
import styles from "./InformationItem.module.css";

function InformationItem({ className = null, label, value }) {
  if (!value) return null;
  return (
    <p className={`${styles.text} ${className}`}>
      <b>{label}:</b> {value}
    </p>
  );
}

export default InformationItem;
