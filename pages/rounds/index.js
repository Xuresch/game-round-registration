// Import required styles and components
import styles from "./GameRound.module.css";
// import EventsCard from "@/components/events/eventsCard";

// Import environment helper to get environment variables
import GameRound from "@/components/rounds/roundsCard";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import ActionCard from "@/components/shared/actionCard/ActionCard";
import { getAllGameRounds } from "@/lib/rounds/roundsService";

// Main component to render the list of events
function RoundPage({ rounds }) {
  const router = useRouter();

  const handleAddRoundClick = () => {
    router.push("/rounds/add");
  };

  const [isLoading, setIsLoading] = useState(true); // Local state to toggle loading state
  const [loadedSession, setLoadedSession] = useState(null); // Local state to store session data
  const [user, setUser] = useState(null); // Local state to store user data

  const [upcomingEvents, setUpcomingEvents] = useState([]); // Local state to store upcoming events
  const [pastEvents, setPastEvents] = useState([]); // Local state to store past events

  // filter and sort events into upcoming and past events
  useEffect(() => {
    if (rounds) {
      const upcoming = rounds.filter((round) => {
        return new Date(round.endTime) >= new Date();
      });
      const past = rounds.filter((round) => {
        return new Date(round.endTime) < new Date();
      });
      setUpcomingEvents(upcoming);
      setPastEvents(past);
    }
  }, [rounds]);

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
      <section className={styles.gameRoundsSection}>
        <div className={styles.gameRoundsHeader}>
          <h1>Kommende Spielrunden</h1>
        </div>
        <div className={styles.gameRoundsContainer}>
          {upcomingEvents?.map((round) => (
            <GameRound key={round.id} round={round} />
          ))}
          {loadedSession && (
            <ActionCard
              title="Neue Spielrunde hinzufügen!"
              onClickHandler={handleAddRoundClick}
            />
          )}
        </div>
      </section>
      <section className={styles.gameRoundsSection}>
        <div className={styles.gameRoundsHeader}>
          <h1>Beendete Spielrunden</h1>
        </div>
        <div className={styles.gameRoundsContainer}>
          {pastEvents?.map((round) => (
            <GameRound key={round.id} round={round} />
          ))}
        </div>
      </section>
    </>
  );
}

export default RoundPage;

export async function getServerSideProps(context) {
  try {
    // Fetch round details
    const rounds = await getAllGameRounds();

    return {
      props: {
        rounds,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      notFound: true, // This will return a 404 page
    };
  }
}
