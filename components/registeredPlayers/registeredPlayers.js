import React, { useState, useEffect } from "react";
import styles from "./RegisteredPlayers.module.css"; // Import the relevant styles

function RegisteredPlayers({ players, waitingList }) {

  return (
    <div className={styles.container}>
      {players.length > 0 && (
        <>
          <h3>Registrierte Spieler</h3>
          <ul className={styles.materialList}>
            {players.map((player) => (
              <li key={player.id}>{player.Player.userName}</li>
            ))}
          </ul>
        </>
      )}

      {waitingList.length > 0 && (
        <>
          <h3>Warteliste</h3>
          <ul className={styles.materialList}>
            {waitingList.map((player) => (
              <li key={player.id}>{player.Player.userName}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default RegisteredPlayers;
