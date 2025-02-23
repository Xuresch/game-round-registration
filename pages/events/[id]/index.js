import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

import styles from "./Event.module.css";
import GameRound from "@/components/rounds/roundsCard";
import { useApiRequest } from "@/hooks/useApiRequest";
import { env } from "@/helpers/env";
import Card from "@/components/shared/card/card";
import ActionCard from "@/components/shared/actionCard/ActionCard";
import useSessionApp from "@/hooks/useSessionApp";
import ActionButtons from "@/components/shared/actionButton/actionButton";
import { getEventGameRounds } from "@/lib/rounds/roundsService";

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

function EventPage({ eventId, rounds }) {
  const router = useRouter();
  const {
    data: event,
    loading: eventLoading,
    error: eventError,
  } = useApiRequest(`${env.BASE_API_URL}/events/${eventId}`);

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
    router.push(`/rounds/add?eventId=${eventId}`);
  };

  const { isLoading, loadedSession, user } = useSessionApp();

  useEffect(() => {
    if (!deleteEventLoading && !deleteEventError && deleteEventData) {
      router.push(`${env.BASE_URL}/events`);
    }
  }, [deleteEventLoading, deleteEventError, deleteEventData]);

  if (eventLoading) {
    return <Loading />;
  }

  if (eventError) {
    //console.log(eventError.response.data);
    const eventErrorMessage = `${eventError.message}: ${eventError.response.data.message}`;
    return <Error message={eventErrorMessage} title="event" />;
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
            <ActionButtons
              loadedSession={loadedSession}
              user={user}
              ownerId={event.organizerId}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
            />
          )}

      </div>
      {event.reservedOnSiteSeats > 0 && <div className={styles.header}>
        <p className={styles.infoText}>
          Hinweis: Bei jeder Spielrunde {event.reservedOnSiteSeats == 1 ? "wird" : "werden"} {event.reservedOnSiteSeats} {event.reservedOnSiteSeats == 1 ? "Platz" : "Plätze"} reserviert, {event.reservedOnSiteSeats == 1 ? "der" : "die"} online nicht buchbar {event.reservedOnSiteSeats == 1 ? "ist" : "sind"}.
        </p>
      </div>}
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

  const rounds = await getEventGameRounds(eventId);

  return {
    props: { eventId, rounds },
  };
}

export default EventPage;
