// Import required styles and components
import styles from "./GameRound.module.css";
// import EventsCard from "@/components/events/eventsCard";

// Import axios for making HTTP requests
import axios from "axios";

// Import environment helper to get environment variables
import { env } from "@/helpers/env";
import GameRound from "@/components/rounds/roundsCard";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useApiRequest } from "@/hooks/useApiRequest";
import ActionCard from "@/components/shared/actionCard/ActionCard";
import { getAllGameRounds } from "@/lib/rounds/roundsService";
import { getGenre } from "@/lib/rounds/genreService";

// Main component to render the list of events
function RoundPage({ rounds }) {
  const router = useRouter();

  const handleAddRoundClick = () => {
    router.push("/rounds/add");
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
      <div className={styles.gameRoundsContainer}>
        {rounds?.map((round) => (
          <GameRound key={round.id} round={round} />
        ))}
        {loadedSession && (
          <ActionCard
            title="Neue Spielrunde hinzufügen!"
            onClickHandler={handleAddRoundClick}
          />
        )}
      </div>
    </>
  );
}

export default RoundPage;

export async function getServerSideProps(context) {
  try {
    // Fetch round details
    const rounds = await getAllGameRounds();

    console.log(rounds);

    const genres = await getGenre();

    for (let round of rounds) {
      const splitRoundGenres = round.genres.split(",");

      const genreDisplayValues = splitRoundGenres.map((code) => {
        const genre = genres.find((g) => g.code === code.trim());
        return genre ? genre.value : code; // Fallback to the code if no matching genre is found
      });

      round.genre = genreDisplayValues.join(", ");
    }

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
