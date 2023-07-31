import styles from "@/styles/EventCard.module.css";

import React from "react";
import Link from "next/link";

import { format } from "date-fns";

function trimText(text, lengthLimit) {
  return text.length > lengthLimit
    ? `${text.substring(0, lengthLimit)}...`
    : text;
}

function EventCard({ event }) {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const formattedStartDate = format(new Date(startDate), 'dd.MM.yyyy HH:mm');
  const formattedEndDate = format(new Date(endDate), 'dd.MM.yyyy HH:mm');

  const isSameDay = format(startDate, 'dd.MM.yyyy') === format(endDate, 'dd.MM.yyyy');
  const displayEndDate = isSameDay ? format(endDate, 'HH:mm') : formattedEndDate;

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{event.name}</h2>
      <p className={styles.text}>
      Beginn: {formattedStartDate} Uhr</p>
      <p className={styles.text}>
      Ende: {displayEndDate} Uhr</p>
      <p className={styles.text}>Location: Jugendhaus Sillenbuch {event.location}</p>
      <p className={`${styles.text} ${styles.description}`}>
        {trimText(event.description, 300)}
      </p>
      <div className={styles.links}>
        <Link href={`/event/${event.id}`} className={styles.readMore}>
          Read more
        </Link>
        {/* <Link href={`/event/${event.id}`} className={styles.readMore}>
          Update
        </Link> */}
      </div>
    </div>
  );
}

export default EventCard;
