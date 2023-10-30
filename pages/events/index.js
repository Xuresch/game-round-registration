// Import required styles and components
import styles from "./Events.module.css";
import EventsCard from "@/components/events/eventsCard";

// Import axios for making HTTP requests
import axios from "axios";

// Import environment helper to get environment variables
import { env } from "@/helpers/env";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import ActionCard from "@/components/shared/actionCard/ActionCard";

// Fetching events data during server-side rendering
export async function getServerSideProps() {
  // Fetch the events from the API
  const res = await axios.get(`${env.BASE_API_URL}/events/`);
  const events = res.data;

  // Return the events data as props to the component
  return {
    props: { events },
  };
}

// Main component to render the list of events
function EventsPage({ events }) {
  const router = useRouter();

  const handleAddEventClick = () => {
    router.push("/events/add");
  };

  const [isLoading, setIsLoading] = useState(true); // Local state to toggle loading state
  const [loadedSession, setLoadedSession] = useState(null); // Local state to store session data
  const [user, setUser] = useState(null); // Local state to store user data
  const [upcomingEvents, setUpcomingEvents] = useState([]); // Local state to store upcoming events
  const [pastEvents, setPastEvents] = useState([]); // Local state to store past events

  // filter and sort events into upcoming and past events
  useEffect(() => {
    if (events) {
      const upcoming = events.filter((event) => {
        return new Date(event.endDate) >= new Date();
      });
      const past = events.filter((event) => {
        return new Date(event.endDate) < new Date();
      });
      setUpcomingEvents(upcoming);
      setPastEvents(past);
    }
  }, [events]);

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

  return (
    <>
      <section className={styles.eventsContainerSection}>
        <div className={styles.eventsHeader}>
          <h1>Kommende Veranstaltungen</h1>
        </div>
        <div className={styles.eventsContainer}>
          {/* Loop through the events and render each one using the EventsCard component */}
          {upcomingEvents.map((event) => (
            <EventsCard key={event.id} event={event} />
          ))}
          {loadedSession &&
            (user.role == "admin" || user.role == "organizer") && (
              <ActionCard
                title="Neue Veranstaltung hinzufügen!"
                onClickHandler={handleAddEventClick}
              />
            )}
        </div>
      </section>
      <section className={styles.eventsContainerSection}>
        <div className={styles.eventsHeader}>
          <h1>Beendete Veranstaltungen</h1>
        </div>
        <div className={styles.eventsContainer}>
          {/* Loop through the events and render each one using the EventsCard component */}
          {pastEvents.map((event) => (
            <EventsCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </>
  );
}

export default EventsPage;
