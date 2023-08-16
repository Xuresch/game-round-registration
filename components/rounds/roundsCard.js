import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import Link from "next/link";
import { env } from "@/helpers/env";
import styles from "./RoundsCard.module.css";
import SmallCard from "@/components/shared/smallCard";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";

// Utility function to trim long text
function trimText(text, lengthLimit) {
  return text.length > lengthLimit
    ? `${text.substring(0, lengthLimit)}...`
    : text;
}

function ContentElement(props) {
  return (
    <div className={styles.roundDescription}>
      {props.title && (
        <p className={styles.contentElement}>
          <b>{props.title}</b>
        </p>
      )}
      <p className={styles.contentElement}>{props.children}</p>
    </div>
  );
}

function GameRound({ round }) {
  const [isLoading, setIsLoading] = useState(true); // Local state to toggle loading state
  const [loadedSession, setLoadedSession] = useState(null); // Local state to store session data
  const [user, setUser] = useState(null); // Local state to store user data

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        setLoadedSession(session);
        setUser(session.user);
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  return (
    <SmallCard>
      <h2 className={styles.title}>{round.name}</h2>
      <ContentElement>{trimText(round.description, 150)}</ContentElement>
      <div className={styles.time}>
        <ContentElement title="Start:">
          {format(new Date(round.startTime), "HH:mm")} Uhr
        </ContentElement>
        <ContentElement title="Ende:">
          {format(new Date(round.endTime), "HH:mm")} Uhr
        </ContentElement>
      </div>
      <ContentElement>
        <b>Genre:</b>{" "}
        {round.genre.charAt(0).toUpperCase() + round.genre.slice(1)}
      </ContentElement>
      <ContentElement>
        <b>Type:</b>{" "}
        {round.gameType.charAt(0).toUpperCase() + round.gameType.slice(1)}
      </ContentElement>
      {round.gameSystem && (
        <ContentElement>
          <b>System:</b> {round.gameSystem}
        </ContentElement>
      )}
      <ContentElement>
        <b>Maximalspieler:</b> {round.playerLimit}
      </ContentElement>
      {round.recommendedAge && (
        <ContentElement>
          <b>Forgeschalgenes Alter:</b> {round.recommendedAge}
        </ContentElement>
      )}
      {round.extraDetails && (
        <ContentElement>
          <b>Zusätzliche Deteils:</b> {round.extraDetails}
        </ContentElement>
      )}
      <div className={styles.links}>
        {loadedSession &&
          (user.id === round.gameMasterId || user.role == "admin") && (
            <button
              // onClick={handleUpdate}
              className={`${styles.button} ${styles.edit}`}
            >
              <FontAwesomeIcon icon={faPenToSquare} size="lg" />
            </button>
          )}
        <Link
          href={`${env.BASE_URL}/rounds/${round.id}`}
          className={styles.button}
        >
          mehr erfahren
        </Link>
        {loadedSession &&
          (user.id === round.gameMasterId || user.role == "admin") && (
            <button
              // onClick={handleDelete}
              className={`${styles.button} ${styles.delete}`}
            >
              <FontAwesomeIcon icon={faTrashCan} size="lg" />
            </button>
          )}
      </div>
    </SmallCard>
  );
}

export default GameRound;
