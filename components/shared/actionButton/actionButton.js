import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import styles from "./ActionButton.module.css";

function ActionButtons({
  loadedSession,
  user,
  ownerId,
  handleUpdate,
  handleDelete,
}) {
  if (!loadedSession || (user.id !== ownerId && user.role !== "admin")) {
    return null;
  }

  return (
    <div className={styles.links}>
      {handleUpdate && (
        <button
          type="button"
          onClick={handleUpdate}
          aria-label="Update round"
          className={`${styles.button} ${styles.edit}`}
        >
          <FontAwesomeIcon icon={faPenToSquare} size="lg" />
        </button>
      )}
      {handleDelete && (
        <button
          type="button"
          onClick={handleDelete}
          aria-label="Delete round"
          className={`${styles.button} ${styles.delete}`}
        >
          <FontAwesomeIcon icon={faTrashCan} size="lg" />
        </button>
      )}
    </div>
  );
}

export default ActionButtons;
