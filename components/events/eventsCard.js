import styles from "@/styles/EventsCard.module.css";

import React from "react";
import Link from "next/link";

import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

function trimText(text, lengthLimit) {
  return text.length > lengthLimit
    ? `${text.substring(0, lengthLimit)}...`
    : text;
}

function EventCard({ event }) {
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
    <div className={styles.card}>
      <h2 className={styles.title}>{event.name}</h2>
      <p className={styles.text}>
        <b>Beginn:</b> {formattedStartDate} Uhr
      </p>
      <p className={styles.text}>
        <b>Ende:</b> {displayEndDate} Uhr
      </p>
      <p className={styles.text}>
        <b>Location:</b> Jugendhaus Sillenbuch {event.location}
      </p>
      <p className={`${styles.text} ${styles.description}`}>
        {trimText(event.description, 300)}
      </p>
      <div className={styles.links}>
        <Link href={`/events/${event.id}`} className={styles.readMore}>
          mehr erfahren
        </Link>
        {/* <Link href={`/event/${event.id}`} className={styles.readMore}>
          Update
        </Link> */}
      </div>
    </div>
  );
}

export default EventCard;
