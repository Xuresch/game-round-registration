import { format } from "date-fns";
import styles from "./RoundsCard.module.css";

function GameRound({ round }) {
  return (
    <div className={styles.roundsCard}>
      <p className={styles.roundsTitle}>Name: {round.name}</p>
      <p className={styles.roundDescription}>
        Beschreibung: {round.description}
      </p>
      <p className={styles.roundDescription}>
        Start: {format(new Date(round.startTime), "HH:mm")}
      </p>
      <p className={styles.roundDescription}>
        Ende: {format(new Date(round.endTime), "HH:mm")}
      </p>
      <p className={styles.roundDescription}>Genre: {round.genre}</p>
      <p className={styles.roundDescription}>Type: {round.gameType}</p>
      <p className={styles.roundDescription}>
        Maximalspieler: {round.playerLimit}
      </p>
      <p className={styles.roundDescription}>
        Forgeschalgenes Alter: {round.recommendedAge}
      </p>
      <p className={styles.roundDescription}>
        Zusätzliche Deteils: {round.extraDetails}
      </p>
    </div>
  );
}

export default GameRound;
