import styles from "@/styles/Events.module.css";
import EventsCard from "@/components/events/eventsCard";

import axios from "axios";

import { env } from "@/helpers/env";

export async function getServerSideProps() {
  const res = await axios.get(`${env.BASE_API_URL}/events/`);
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
        <EventsCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default EventsPage;
