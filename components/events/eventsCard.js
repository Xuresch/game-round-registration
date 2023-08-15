// Import necessary dependencies
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { format, isSameDay } from "date-fns"; // Import isSameDay directly
import { utcToZonedTime } from "date-fns-tz";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";

import { getSession } from "next-auth/react";

// Import custom hooks and styles
import { useApiRequest } from "@/hooks/useApiRequest";
import SmallCard from "@/components/shared/smallCard";
import styles from "./EventsCard.module.css";
import { env } from "@/helpers/env";


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
    organizerId,
  } = event; // Destructure here

  const router = useRouter();
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Convert dates to user's timezone and format them
  const startDate = utcToZonedTime(new Date(rawStartDate), userTimeZone);
  const endDate = utcToZonedTime(new Date(rawEndDate), userTimeZone);

  const formattedStartDate = format(startDate, "dd.MM.yyyy HH:mm");
  const formattedEndDate = isSameDay(startDate, endDate)
    ? format(endDate, "HH:mm")
    : format(endDate, "dd.MM.yyyy HH:mm");

  // API request to delete event
  const {
    fetchData: deleteEvent,
    data: deleteEventData,
    loading: deleteEventLoading,
    error: deleteEventError,
  } = useApiRequest(
    `${env.BASE_API_URL}/events/${eventId}`, // Use environment variable
    "DELETE",
    false
  );

  // Handler for delete button click
  const handleDelete = async () => {
    try {
      await deleteEvent();
    } catch (err) {
      console.error("Failed to delete event:", err);
    }
  };

  // Handler for update button click
  const handleUpdate = () => {
    router.push(`/events/${eventId}/update`);
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

  // Redirect to events page after successful deletion
  useEffect(() => {
    if (!deleteEventLoading && !deleteEventError && deleteEventData) {
      router.push("/events");
    }
  }, [deleteEventLoading, deleteEventError, deleteEventData]);

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
          {loadedSession &&
            (user.id === organizerId || user.role == "admin") && (
              <button
                onClick={handleUpdate}
                className={`${styles.button} ${styles.edit}`}
              >
                <FontAwesomeIcon icon={faPenToSquare} size="lg" />
              </button>
            )}
          <Link href={`/events/${eventId}`} className={styles.button}>
            mehr erfahren
          </Link>
          {loadedSession &&
            (user.id === organizerId || user.role == "admin") && (
              <button
                onClick={handleDelete}
                className={`${styles.button} ${styles.delete}`}
              >
                <FontAwesomeIcon icon={faTrashCan} size="lg" />
              </button>
            )}
        </div>
      </SmallCard>
    </>
  );
}

export default EventCard;
