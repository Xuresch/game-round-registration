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
      <div className={styles.eventsContainer}>
        {/* Loop through the events and render each one using the EventsCard component */}
        {events.map((event) => (
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
    </>
  );
}

export default EventsPage;
