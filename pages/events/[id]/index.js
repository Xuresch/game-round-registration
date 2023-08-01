import styles from "@/styles/Event.module.css";

import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import axios from "axios";
import { ro } from "date-fns/locale";

export async function getServerSideProps(context) {
  const eventId = context.params.id;

  const event_res = await axios.get(
    `http://localhost:3000/api/events/${eventId}`
  );
  const event = event_res.data;

  const round_res = await axios.get(
    `http://localhost:3000/api/gameRounds?eventId=${eventId}`
  );
  const rounds = round_res.data;

  return {
    props: { event, rounds },
  };
}

function EventPage({ event, rounds }) {
  // console.log(event);

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

  if (rounds.length > 0) {
    rounds = (
      <div className={styles.rounds}>
        <h3 className={styles.rounds_title}>Spielrunden</h3>
        <div className={styles.rounds_contaioner}>
          {rounds.map((round) => (
            <div key={round.id} className={styles.round_card}>
              <p className={styles.round_name}>Name: {round.name}</p>
              <p className={styles.round_description}>Beschreibung: {round.description}</p>
              <p className={styles.round_description}>Start: {format(new Date(round.startTime), "HH:mm")}</p>
              <p className={styles.round_description}>Ende: {format(new Date(round.endTime), "HH:mm")}</p>
              <p className={styles.round_description}>Genre: {round.genre}</p>
              <p className={styles.round_description}>Type: {round.gameType}</p>
              <p className={styles.round_description}>Maximalspieler: {round.playerLimit}</p>
              <p className={styles.round_description}>Forgeschalgenes Alter: {round.recommendedAge}</p>
              <p className={styles.round_description}>Zusätzliche Deteils: {round.extraDetails}</p>

            </div>
          ))}
        </div>
      </div>
    );
  } else {
    rounds = (
      <div className={styles.rounds}>
        {/* <h3 className={styles.rounds_title}>Spielrunden</h3> */}
      </div>
    );
  }

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
        {rounds}
      </div>
    </div>
  );
}

export default EventPage;
