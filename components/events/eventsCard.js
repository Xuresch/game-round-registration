// Import necessary dependencies
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { format, isSameDay } from "date-fns"; // Import isSameDay directly
import { utcToZonedTime } from "date-fns-tz";

// Import custom hooks and styles
import SmallCard from "@/components/shared/smallCard/smallCard";
import styles from "./EventsCard.module.css";


// Utility function to trim long text
function trimText(text, lengthLimit) {
  return text.length > lengthLimit
    ? `${text.substring(0, lengthLimit)}...`
    : text;
}

// EventCard component displays individual event details
function EventCard({ event }) {
  const {
    id: eventId,
    name,
    description,
    startDate: rawStartDate,
    endDate: rawEndDate,
  } = event; // Destructure here

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Convert dates to user's timezone and format them
  const startDate = utcToZonedTime(new Date(rawStartDate), userTimeZone);
  const endDate = utcToZonedTime(new Date(rawEndDate), userTimeZone);

  const formattedStartDate = format(startDate, "dd.MM.yyyy HH:mm");
  const formattedEndDate = isSameDay(startDate, endDate)
    ? format(endDate, "HH:mm")
    : format(endDate, "dd.MM.yyyy HH:mm");

  // Render the event card
  return (
    <>
      <SmallCard>
        <h2 className={styles.title}>{name}</h2>
        <div className={styles.description}>{trimText(description, 150)}</div>
        <div className={styles.dateRange}>
          {formattedStartDate} - {formattedEndDate}
        </div>
        <div className={styles.links}>
          <Link href={`/events/${eventId}`} className={styles.button}>
            mehr erfahren
          </Link>
        </div>
      </SmallCard>
    </>
  );
}

export default EventCard;
