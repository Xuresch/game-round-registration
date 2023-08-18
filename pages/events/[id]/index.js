import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

import { getSession } from "next-auth/react";

import styles from "./Event.module.css";
import GameRound from "@/components/rounds/roundsCard";
import { useApiRequest } from "@/hooks/useApiRequest";
import { env } from "@/helpers/env";
import Card from "@/components/shared/card";
import ActionCard from "@/components/shared/actionCard/ActionCard";

function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Loading...</h2>
      </div>
    </div>
  );
}

function Error({ title, message }) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Error loading {title}</h2>
        <p className={styles.text}>{message}</p>
      </div>
    </div>
  );
}

function EventPage({ eventId }) {
  const router = useRouter();
  const {
    data: event,
    loading: eventLoading,
    error: eventError,
  } = useApiRequest(`${env.BASE_API_URL}/events/${eventId}`);
  const {
    data: rounds,
    loading: roundsLoading,
    error: roundsError,
  } = useApiRequest(`${env.BASE_API_URL}/gameRounds?eventId=${eventId}`);
  const {
    fetchData: deleteEvent,
    data: deleteEventData,
    loading: deleteEventLoading,
    error: deleteEventError,
  } = useApiRequest(`${env.BASE_API_URL}/events/${eventId}`, "DELETE", false);

  const handleDelete = async () => {
    try {
      await deleteEvent();
    } catch (err) {
      console.error("Failed to delete event:", err);
    }
  };

  const handleUpdate = () => {
    router.push(`${env.BASE_URL}/events/${eventId}/update`);
  };

  const handleAddRoundClick = () => {
    router.push("/rounds/add");
  };

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

  useEffect(() => {
    if (!deleteEventLoading && !deleteEventError && deleteEventData) {
      router.push(`${env.BASE_URL}/events`);
    }
  }, [deleteEventLoading, deleteEventError, deleteEventData]);

  if (eventLoading || roundsLoading) {
    return <Loading />;
  }

  if (eventError) {
    console.log(eventError.response.data);
    const eventErrorMessage = `${eventError.message}: ${eventError.response.data.message}`;
    return <Error message={eventErrorMessage} title="event" />;
  }

  if (roundsError) {
    return <Error message={roundsError.message} title="rounds" />;
  }

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const startDate = utcToZonedTime(new Date(event.startDate), userTimeZone);
  const endDate = utcToZonedTime(new Date(event.endDate), userTimeZone);

  const formattedStartDate = format(startDate, "dd.MM.yyyy HH:mm");
  const formattedEndDate = format(endDate, "dd.MM.yyyy HH:mm");
  const isSameDay =
    format(startDate, "dd.MM.yyyy") === format(endDate, "dd.MM.yyyy");
  const displayEndDate = isSameDay
    ? format(endDate, "HH:mm")
    : formattedEndDate;

  return (
    <Card>
      <div className={styles.header}>
        <h2 className={styles.title}>{event.name}</h2>
        {loadedSession &&
          (user.id === event.organizerId || user.role == "admin") && (
            <div className={styles.links}>
              <button
                onClick={handleUpdate}
                className={`${styles.button} ${styles.edit}`}
              >
                <FontAwesomeIcon icon={faPenToSquare} size="lg" />
              </button>
              <button
                onClick={handleDelete}
                className={`${styles.button} ${styles.delete}`}
              >
                <FontAwesomeIcon icon={faTrashCan} size="lg" />
              </button>
            </div>
          )}
      </div>
      <div className={styles.content}>
        <div className={styles.informations}>
          <p className={styles.text}>
            <b>Beginn:</b> {formattedStartDate} Uhr
          </p>
          <p className={styles.text}>
            <b>Ende:</b> {displayEndDate} Uhr
          </p>
          <p className={styles.text}>
            <b>Location:</b> Jugendhaus Sillenbuch {event.location}
          </p>
        </div>
        <div className={styles.description}>
          <p className={styles.text}>{event.description}</p>
        </div>
      </div>
      <div className={styles.rounds}>
        <h3 className={styles.roundsTitle}>Spielrunden</h3>
        <div className={styles.roundsContaioner}>
          {rounds.length > 0 ? (
            <>
              {rounds.map((round) => (
                <GameRound key={round.id} round={round} />
              ))}
            </>
          ) : null}
          {loadedSession && (
            <ActionCard
              title="Neue Spielrunde hinzufügen!"
              onClickHandler={handleAddRoundClick}
            />
          )}
        </div>
      </div>
    </Card>
  );
}

export async function getServerSideProps(context) {
  const eventId = context.params.id;

  return {
    props: { eventId },
  };
}

export default EventPage;
