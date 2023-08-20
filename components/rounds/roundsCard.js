import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import Link from "next/link";
import { env } from "@/helpers/env";
import styles from "./RoundsCard.module.css";
import SmallCard from "@/components/shared/smallCard/smallCard";
import { useEffect, useState } from "react";
import useSessionApp from "@/hooks/useSessionApp";
import { useApiRequest } from "@/hooks/useApiRequest";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const { isSessionLoading, loadedSession, user } = useSessionApp();

  const {
    fetchData: deleteGameRound,
    data: deleteGameRoundData,
    loading: deleteGameRoundLoading,
    error: deleteGameRoundError,
  } = useApiRequest(
    `${env.BASE_API_URL}/gameRounds/${round.id}`, // Use environment variable
    "DELETE",
    false
  );

  // Handler for delete button click
  const handleDelete = async () => {
    try {
      await deleteGameRound();
    } catch (err) {
      console.error("Failed to delete round:", err);
    }
  };

  useEffect(() => {
    if (
      !deleteGameRoundLoading &&
      !deleteGameRoundError &&
      deleteGameRoundData
    ) {
      router.push(`${env.BASE_URL}/events`);
    }
  }, [deleteGameRoundLoading, deleteGameRoundError, deleteGameRoundData]);

  // Handler for update button click
  const handleUpdate = () => {
    router.push(`${env.BASE_URL}/rounds/${round.id}/update`);
  };

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
      {round.playerLimit > 0 && (
        <ContentElement>
          <b>Spieler Anzahl:</b> {round.registeredPlayersCount} von{" "}
          {round.playerLimit}
        </ContentElement>
      )}
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
              onClick={handleUpdate}
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
              onClick={handleDelete}
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
