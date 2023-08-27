import React, { useState, useEffect } from "react";
import Modal from "./modal";

import styles from "./MultiSelectModal.module.css";

function MultiSelectModal({
  isOpen,
  onClose,
  options,
  initialSelectedOptions,
  onChange,
}) {
  const [selectedOptions, setSelectedOptions] = useState(
    initialSelectedOptions
  );

  useEffect(() => {
    setSelectedOptions(initialSelectedOptions);
  }, [initialSelectedOptions]);

  function toggleOption(option) {
    const isSelected = selectedOptions.some(
      (selectedOption) => selectedOption.code === option.code
    );
    const newSelectedOptions = isSelected
      ? selectedOptions.filter(
          (selectedOption) => selectedOption.code !== option.code
        )
      : [...selectedOptions, option];
    setSelectedOptions(newSelectedOptions);
  }

  function handleDone() {
    onChange(selectedOptions);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Options">
      <div className={styles.optionsContainer}>
        {options.map((option) => (
          <div key={option.code} className={styles.optionContainer}>
            <input
              type="checkbox"
              className={styles.optionCheckbox}
              checked={selectedOptions.some(
                (selectedOption) => selectedOption.code === option.code
              )}
              onChange={() => toggleOption(option)}
            />
            <div className={styles.optionLabel}>{option.value}</div>
          </div>
        ))}
      </div>
      <button className={styles.doneButton} onClick={handleDone}>
        Done
      </button>
    </Modal>
  );
}

export default MultiSelectModal;
