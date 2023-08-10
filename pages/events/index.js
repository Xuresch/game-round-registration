// Import required styles and components
import styles from "./Events.module.css";
import EventsCard from "@/components/events/eventsCard";

// Import axios for making HTTP requests
import axios from "axios";

// Import environment helper to get environment variables
import { env } from "@/helpers/env";

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
  return (
    <div className={styles.eventsContainer}>
      {/* Loop through the events and render each one using the EventsCard component */}
      {events.map((event) => (
        <EventsCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default EventsPage;
