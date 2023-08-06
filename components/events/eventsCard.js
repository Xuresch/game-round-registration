import styles from "@/styles/EventsCard.module.css";

import React from "react";
import Link from "next/link";

import { useRouter } from "next/router";

import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useSWR from "swr";

import { useApiRequest } from "@/hooks/useApiRequest";
import { env } from "@/helpers/env";

function trimText(text, lengthLimit) {
  return text.length > lengthLimit
    ? `${text.substring(0, lengthLimit)}...`
    : text;
}

const fetcher = (url) => axios.get(url).then((res) => res.data);

function EventCard({ event }) {
  const router = useRouter();
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { data: userData } = useSWR(`${env.BASE_API_URL}/auth/user`, fetcher);
  const user = userData?.user;

  const startDate = utcToZonedTime(new Date(event.startDate), userTimeZone);
  const endDate = utcToZonedTime(new Date(event.endDate), userTimeZone);

  const formattedStartDate = format(startDate, "dd.MM.yyyy HH:mm");
  const formattedEndDate = format(endDate, "dd.MM.yyyy HH:mm");
  const isSameDay =
    format(startDate, "dd.MM.yyyy") === format(endDate, "dd.MM.yyyy");
  const displayEndDate = isSameDay
    ? format(endDate, "HH:mm")
    : formattedEndDate;

  const {
    fetchData: deleteEvent,
    data: deleteEventData,
    loading: deleteEventLoading,
    error: deleteEventError,
  } = useApiRequest(`${env.BASE_API_URL}/events/${event.id}`, "DELETE", false);

  const handleDelete = async () => {
    try {
      await deleteEvent();
    } catch (err) {
      console.error("Failed to delete event:", error);
    }
  };

  const handleUpdate = () => {
    router.push(`${env.BASE_URL}/events/${event.id}/update`);
  };

  React.useEffect(() => {
    if (!deleteEventLoading && !deleteEventError && deleteEventData) {
      router.push(`${env.BASE_URL}/events`);
    }
  }, [deleteEventLoading, deleteEventError, deleteEventData]);

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
        {user && (user.role === "admin" || user.id === event.organizerId) && (
          <button
            onClick={handleUpdate}
            className={`${styles.button} ${styles.edit}`}
          >
            <FontAwesomeIcon icon={faPenToSquare} size="lg" />
          </button>
        )}
        <button
          onClick={() => {
            router.push(`${env.BASE_URL}/events/${event.id}`);
          }}
          className={styles.button}
        >
          mehr erfahren
        </button>
        {user && (user.role === "admin" || user.id === event.organizerId) && (
          <button
            onClick={handleDelete}
            className={`${styles.button} ${styles.delete}`}
          >
            <FontAwesomeIcon icon={faTrashCan} size="lg" />
          </button>
        )}
      </div>
    </div>
  );
}

export default EventCard;
