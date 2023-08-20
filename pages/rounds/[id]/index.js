import Card from "@/components/shared/card/card";
import { useRouter } from "next/router";

import styles from "./Round.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useSessionApp from "@/hooks/useSessionApp";
import { env } from "@/helpers/env";
import { utcToZonedTime } from "date-fns-tz";
import { format } from "date-fns";
import axios from "axios";
import { useApiRequest } from "@/hooks/useApiRequest";
import { useEffect, useState } from "react";
import RegisteredPlayers from "@/components/registeredPlayers/registeredPlayers";
import { getSession } from "next-auth/react";

function DeteilRoundPage({ round, gameMaster, user }) {
  const router = useRouter();

  const { isSessionLoading, loadedSession } = useSessionApp();
  const [playerRegistration, setPlayerRegistration] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const {
    fetchData: createPlayerRegistration,
    data: createdPlayerRegistrationData,
    loading: createPlayerRegistrationLoading,
    error: createPlayerRegistrationError,
  } = useApiRequest(`${env.BASE_API_URL}/playerRegistrations`, "POST", false);

  const {
    fetchData: deleteGameRound,
    data: deleteGameRoundData,
    loading: deleteGameRoundLoading,
    error: deleteGameRoundError,
  } = useApiRequest(
    `${env.BASE_API_URL}/gameRounds/${round.id}`, // Use environment variable
    "DELETE",
    false
  );

  async function getPlayerRegistarion() {
    axios
      .get(
        `${env.BASE_API_URL}/playerRegistrations?playerId=${user?.id}&gameRoundId=${round.id}`
      )
      .then((res) => {
        // console.log(res.data[0]);
        setPlayerRegistration(res.data[0]);
      });
  }

  async function promoteOldestWaitingPlayer() {
    // Check if the current game round has the waitingList flag enabled
    if (round.waitingList) {
      try {
        // Fetch players with a status of "waiting" for the current game round
        const response = await axios.get(
          `${env.BASE_API_URL}/playerRegistrations?gameRoundId=${round.id}&status=waiting`
        );
        const waitingPlayers = response.data;

        // If there are players in the waiting list
        if (waitingPlayers.length > 0) {
          // Sort players based on the 'joinedAt' field to get the oldest player
          const oldestWaitingPlayer = waitingPlayers.sort(
            (a, b) => new Date(a.joinedAt) - new Date(b.joinedAt)
          )[0];

          // Update the oldest player's status to "registered"
          await axios.put(
            `${env.BASE_API_URL}/playerRegistrations/${oldestWaitingPlayer.id}`,
            {
              status: "registered",
              joinedAt: new Date(),
            }
          );

          // Optionally, you can also update the local state or refetch data if needed
          getPlayerRegistarion();
        }
      } catch (error) {
        console.error("Error promoting waiting list player:", error);
        // Handle the error appropriately, possibly notifying the user
      }
    }
  }

  useEffect(() => {
    getPlayerRegistarion();
  }, [isLoading]);

  const handleButtonClick = async () => {
    setIsLoading(true); // set loading state to true

    if (buttonLabel === "Abmelden") {
      try {
        await axios.delete(
          `${env.BASE_API_URL}/playerRegistrations/${playerRegistration.id}`
        );
        setPlayerRegistration(null);

        promoteOldestWaitingPlayer();
      } catch (err) {
        console.error(err);
        // Possibly show an error message to the user
      }
      setIsLoading(false); // reset loading state to false
    } else if (buttonLabel === "Registrieren") {
      if (loadedSession === null) {
        //redirect to login
        router.push("/auth");
      } else {
        const data = {
          playerId: user.id,
          gameRoundId: round.id,
          status: "registered",
          joinedAt: new Date(),
        };

        try {
          await createPlayerRegistration(data);
        } catch (err) {
          console.error(err);
        }
      }
      setIsLoading(false); // reset loading state to false
    } else if (buttonLabel === "Zur Warteliste hinzufügen") {
      if (loadedSession === null) {
        //redirect to login
        router.push("/auth");
      } else {
        const data = {
          playerId: user.id,
          gameRoundId: round.id,
          status: "waiting",
          joinedAt: new Date(),
        };

        try {
          await createPlayerRegistration(data);
        } catch (err) {
          console.error(err);
        }
      }
      setIsLoading(false); // reset loading state to false
    }
  };

  // Handler for delete button click
  const handleDelete = async () => {
    try {
      await deleteGameRound();
    } catch (err) {
      console.error("Failed to delete round:", err);
    }
  };

  useEffect(() => {
    if (
      !deleteGameRoundLoading &&
      !deleteGameRoundError &&
      deleteGameRoundData
    ) {
      router.push(`${env.BASE_URL}/events`);
    }
  }, [deleteGameRoundLoading, deleteGameRoundError, deleteGameRoundData]);

  // Handler for update button click
  const handleUpdate = () => {
    router.push(`${env.BASE_URL}/rounds/${round.id}/update`);
  };

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const startDate = round?.startTime
    ? utcToZonedTime(new Date(round.startTime), userTimeZone)
    : null;
  const endDate = round?.endTime
    ? utcToZonedTime(new Date(round.endTime), userTimeZone)
    : null;

  const formattedStartDate = startDate
    ? format(startDate, "dd.MM.yyyy HH:mm")
    : "";
  const formattedEndDate = endDate ? format(endDate, "dd.MM.yyyy HH:mm") : "";
  const isSameDay =
    startDate &&
    endDate &&
    format(startDate, "dd.MM.yyyy") === format(endDate, "dd.MM.yyyy");
  const displayEndDate = isSameDay
    ? endDate
      ? format(endDate, "HH:mm")
      : ""
    : formattedEndDate;

  let buttonLabel = "";
  let buttonDisabled = false;

  if (playerRegistration && loadedSession) {
    buttonLabel = "Abmelden";
  } else if (round.registeredPlayersCount < round.playerLimit) {
    buttonLabel = "Registrieren";
  } else if (round.waitingList) {
    buttonLabel = "Zur Warteliste hinzufügen";
  } else {
    buttonLabel = "Spielrunde ist voll";
    buttonDisabled = true;
  }

  return (
    <Card>
      <div className={styles.header}>
        <h2 className={styles.title}>{round.name}</h2>
        <p className={`${styles.text} ${styles.gameMaster}`}>
          <b>Spielleiter:</b> {gameMaster.data.userName}
        </p>
        {loadedSession &&
          (user.id === round.gameMasterId || user.role == "admin") && (
            <div className={styles.links}>
              <button
                onClick={handleUpdate}
                className={`${styles.button} ${styles.edit}`}
              >
                <FontAwesomeIcon icon={faPenToSquare} size="lg" />
              </button>
              <button
                onClick={handleDelete}
                className={`${styles.button} ${styles.delete}`}
              >
                <FontAwesomeIcon icon={faTrashCan} size="lg" />
              </button>
            </div>
          )}
      </div>
      <div className={styles.content}>
        <div className={styles.informations}>
          <p className={styles.text}>
            <b>Spieltype</b>{" "}
            {round.gameType.charAt(0).toUpperCase() + round.gameType.slice(1)}
          </p>
          <p className={styles.text}>
            <b>System:</b> {round.gameSystem}
          </p>
          <p className={styles.text}>
            <b>Genre:</b>{" "}
            {round.genre.charAt(0).toUpperCase() + round.genre.slice(1)}
          </p>
          {round.recommendedAge && (
            <p className={styles.text}>
              <b>Altersempfehlung:</b> {round.recommendedAge} Jahre
            </p>
          )}
          {round.playerLimit > 0 && (
            <p className={styles.text}>
              <b>Spieler Anzahl:</b> {round.registeredPlayersCount} von{" "}
              {round.playerLimit}
            </p>
          )}
          <p className={styles.text}>
            <b>Beginn:</b> {formattedStartDate} Uhr
          </p>
          <p className={styles.text}>
            <b>Ende:</b> {displayEndDate} Uhr
          </p>
        </div>
        <div className={styles.description}>
          <p className={styles.text}>{round.description}</p>
          <p className={styles.text}>{round.extraDetails}</p>
        </div>
      </div>
      <div className={styles.playerWrapper}></div>
      <div className={styles.buttonWrapper}>
        <button
          className={`${styles.button} ${styles.save} ${
            buttonDisabled ? styles.disabled : ""
          }`}
          onClick={handleButtonClick}
          disabled={buttonDisabled || isLoading} // disable button while loading
        >
          {isLoading ? "Laden..." : buttonLabel}
        </button>
      </div>
      <RegisteredPlayers gameRoundId={round.id} isLoading={isLoading} />
    </Card>
  );
}

export default DeteilRoundPage;

export async function getServerSideProps(context) {
  const { id } = context.params; // Extract the round ID from the context

  try {
    const sessionGet = await getSession({ req: context.req });
    const user = sessionGet?.user || null;

    // Fetch round details
    const roundRes = await axios.get(`${env.BASE_API_URL}/gameRounds/${id}`);
    const round = roundRes.data;

    // Fetch gameMaster details
    const gameMasterRes = await axios.get(
      `${env.BASE_API_URL}/users/${round.gameMasterId}`
    );
    const gameMaster = gameMasterRes.data;

    return {
      props: {
        round,
        gameMaster,
        user,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      notFound: true, // This will return a 404 page
    };
  }
}
