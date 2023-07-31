import styles from "@/styles/Events.module.css";
import EventCard from "@/components/events/eventCard";

import axios from "axios";

export async function getServerSideProps() {
  const res = await axios.get("http://localhost:3000/api/events/");
  const events = res.data;

  return {
    props: { events },
  };
}

function EventsPage({ events }) {
  // console.log(events);
  return (
    <div className={styles.eventsContainer}>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default EventsPage;
