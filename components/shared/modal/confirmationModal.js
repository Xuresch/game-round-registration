import React, { useState, useEffect } from "react";
import Modal from "./modal";

import styles from "./ConfirmationModal.module.css";

function ConfirmationModal({ isOpen, onClose, deleteObject, onDelete }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Löschen bestätigen">
      <div className={styles.confirmationModal}>
        <p>
          Willst du den Eintrag <b>{deleteObject}</b> wirklich löschen?
        </p>
        <div className={styles.confirmationModalButtons}>
          <button onClick={onClose} className={styles.button}>
            Abbrechen
          </button>
          <button
            onClick={onDelete}
            className={`${styles.button} ${styles.deletionButton}`}
          >
            Löschen
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmationModal;
