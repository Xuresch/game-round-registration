import styles from "@/styles/Event.module.css";

import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

import GameRound from "@/components/rounds/roundsCard";

import { useApiRequest } from "@/hooks/useApiRequest";

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
  const {
    data: event,
    loading: eventLoading,
    error: eventError,
  } = useApiRequest(`http://localhost:3000/api/events/${eventId}`);
  const {
    data: rounds,
    loading: roundsLoading,
    error: roundsError,
  } = useApiRequest(`http://localhost:3000/api/gameRounds?eventId=${eventId}`);

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
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>{event.name}</h2>
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
        {rounds.length > 0 ? (
          <div className={styles.rounds}>
            <h3 className={styles.roundsTitle}>Spielrunden</h3>
            <div className={styles.roundsContaioner}>
              {rounds.map((round) => (
                <GameRound key={round.id} round={round} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const eventId = context.params.id;

  return {
    props: { eventId },
  };
}

export default EventPage;
