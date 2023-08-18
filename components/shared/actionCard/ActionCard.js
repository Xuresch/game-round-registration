import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import styles from "./ActionCard.module.css";
import SmallCard from "../smallCard";

const ActionCard = ({ title, onClickHandler }) => {
  // Handle key events for accessibility
  const handleKeyDown = (event) => {
    // Allow the "Enter" or "Space" key to trigger the onClickHandler
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault(); // Prevents any default behavior (e.g., scrolling on space)
      onClickHandler();
    }
  };

  return (
    <SmallCard>
      {/* 
        This div is acting as a button for better accessibility.
        We add a role attribute to indicate it's a button and a tabIndex to make it focusable.
      */}
      <div
        className={styles.ActionCardContainer}
        onClick={onClickHandler}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex="0"
      >
        <h2 className={styles.ActionCardTitle}>{title}</h2>
        <FontAwesomeIcon icon={faPlus} size="2xl" />
      </div>
    </SmallCard>
  );
};

// Define propTypes to ensure the component receives the correct data types
ActionCard.propTypes = {
  title: PropTypes.string.isRequired,
  onClickHandler: PropTypes.func.isRequired,
};

export default ActionCard;
