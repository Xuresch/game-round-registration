// Import required styles and components
import styles from "./GameRound.module.css";
// import EventsCard from "@/components/events/eventsCard";

// Import axios for making HTTP requests
import axios from "axios";

// Import environment helper to get environment variables
import { env } from "@/helpers/env";
import SmallCard from "@/components/shared/smallCard";
import GameRound from "@/components/rounds/roundsCard";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useApiRequest } from "@/hooks/useApiRequest";

// export async function getServerSideProps() {
//   const res = await axios.get(`${env.BASE_API_URL}/gameRounds`);
//   const gameRounds = res.data;

//   return {
//     props: { gameRounds },
//   };
// }

// Main component to render the list of events
function RoundPage() {
  const router = useRouter();

  // console.log(`${env.BASE_API_URL}/gameRounds`);
  const {
    data: rounds,
    loading: roundsLoading,
    error: roundsError,
  } = useApiRequest(`${env.BASE_API_URL}/gameRounds`);

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
          <SmallCard>
            <div
              className={styles.roundAddContainer}
              onClick={handleAddRoundClick}
            >
              <h2 className={styles.title}>Neue Spielrunde hinzufügen</h2>
              <FontAwesomeIcon icon={faPlus} size="2xl" />
            </div>
          </SmallCard>
        )}
      </div>
    </>
  );
}

export default RoundPage;
