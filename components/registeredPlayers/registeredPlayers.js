import React, { useState, useEffect } from "react";
import styles from "./RegisteredPlayers.module.css"; // Import the relevant styles
import axios from "axios";
import { env } from "@/helpers/env";

function RegisteredPlayers({ gameRoundId, isLoading }) {
  const [players, setPlayers] = useState([]);
  const [waitingList, setWaitingList] = useState([]);

  useEffect(() => {
    // Fetch the registered players
    axios
      .get(
        `${env.BASE_API_URL}/playerRegistrations?gameRoundId=${gameRoundId}&status=registered`
      )
      .then((response) => {
        setPlayers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching registered players:", error);
      });

    // Fetch the waiting list
    axios
      .get(
        `${env.BASE_API_URL}/playerRegistrations?gameRoundId=${gameRoundId}&status=waiting`
      )
      .then((response) => {
        setWaitingList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching waiting list:", error);
      });
  }, [gameRoundId, isLoading]);

  return (
    <div className={styles.container}>
      <h3>Registrierte Spieler</h3>
      <ul className={styles.materialList}>
        {players.map((player) => (
          <li key={player.id}>{player.Player.userName}</li>
        ))}
      </ul>

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
