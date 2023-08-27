import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import styles from "./GenresFormField.module.css";

function GenresFormField({ selectedGenres, handleDeleteGenre, setModalOpen }) {
  return (
    <div className={styles.generesContainer}>
      <label className={styles.genresLabel}>
        <b>Genres:</b>
      </label>
      <div className={styles.selectedGenresContainer}>
        {selectedGenres?.map((genre) => (
          <div key={genre.code} className={styles.selectedGenre}>
            {genre.value}
            <button
              type="button"
              className={styles.deleteGenreButton}
              onClick={() => handleDeleteGenre(genre)}
            >
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className={styles.addGenreButton}
        onClick={() => setModalOpen(true)}
      >
        Add
      </button>
    </div>
  );
}

export default GenresFormField;
