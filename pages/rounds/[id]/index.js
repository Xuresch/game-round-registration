// External libraries
import { useEffect, useState } from "react";

// Next.js related
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

// Local module imports
import Card from "@/components/shared/card/card";
import useSessionApp from "@/hooks/useSessionApp";
import { env } from "@/helpers/env";
import RegisteredPlayers from "@/components/registeredPlayers/registeredPlayers";
import {
  deletePlayerRegistration,
  getPlayerRegistration,
  getRegisteredPlayers,
  getWaitingPlayers,
  promoteOldestWaitingPlayer,
  registerPlayer,
} from "@/lib/rounds/playerRegistrationService";
import { deleteGameRound, getGameRound } from "@/lib/rounds/roundsService";

// Styles
import styles from "./Round.module.css";
import { formatRoundDates } from "@/helpers/dateFormatter";
import ActionButtons from "@/components/shared/actionButton/actionButton";
import InformationItem from "@/components/shared/informationItem/informationItem";
import { getUser } from "@/lib/user/userService";
import apiService from "@/lib/shared/apiService";

function DeteilRoundPage({ round, gameMaster, user }) {
  const router = useRouter();

  const { isSessionLoading, loadedSession } = useSessionApp();
  const [playerRegistration, setPlayerRegistration] = useState(null);
  const [deleteGameRoundLoading, setDeleteGameRoundLoading] = useState(false);
  const [deleteGameRoundData, setDeleteGameRoundData] = useState(null);
  const [deleteGameRoundError, setDeleteGameRoundError] = useState(null);
  const [registeredPlayersCount, setRegisteredPlayersCount] = useState(
    round.registeredPlayersCount
  );

  const [players, setPlayers] = useState([]);
  const [waitingList, setWaitingList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchPlayerRegistration() {
      const registration = await getPlayerRegistration(user?.id, round.id);
      setPlayerRegistration(registration);
      const players = await getRegisteredPlayers(round.id);
      setPlayers(players);
      const waitingList = await getWaitingPlayers(round.id);
      setWaitingList(waitingList);
    }

    fetchPlayerRegistration();
  }, [isLoading]);

  const handleUnregister = async () => {
    await deletePlayerRegistration(playerRegistration.id);
    setPlayerRegistration(null);
    const oldestWaitingPlayer = await promoteOldestWaitingPlayer(round);
    const players = await getRegisteredPlayers(round.id);
    setPlayers(players);
    const waitingList = await getWaitingPlayers(round.id);
    setWaitingList(waitingList);
    if (waitingList.length === 0) {
      setRegisteredPlayersCount((prevCount) => prevCount - 1);
    }
    if (oldestWaitingPlayer) {
      sendEmailDataPlayer(round, oldestWaitingPlayer.Player);
      sendWaitinglistUpdateEmailDataGm(round, user, oldestWaitingPlayer.Player);
      sendUnregistEmailDataPlayer(round);
    } else {
      sendUnregistEmailDataPlayer(round);
      sendUnregistEmailDataGm(round);
    }
  };

  async function sendEmailDataPlayer(roundData, userData=user) {
    try {
      const emailData = {
        templateName: "registNewPlayer",
        templateData: {
          name: userData.userName,
          roundName: roundData.name,
          roundUrl: `${env.BASE_URL}/rounds/${roundData.id}`,
        },
        emailDetails: {
          to: userData.email,
          subject: `Registrierung für Spielrunde ${roundData.name}!`,
        },
      };
      const response = await apiService.sendEmail(emailData);
      console.log("Email sent successfully:", response);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  async function sendUnregistEmailDataPlayer(roundData) {
    try {
      const emailData = {
        templateName: "unregistPlayer",
        templateData: {
          name: user.userName,
          roundName: roundData.name,
        },
        emailDetails: {
          to: user.email,
          subject: `Abmeldung von Spielrunde ${roundData.name}!`,
        },
      };
      const response = await apiService.sendEmail(emailData);
      console.log("Email sent successfully:", response);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  async function sendWaitinglistEmailDataPlayer(roundData) {
    try {
      const emailData = {
        templateName: "waitinglistPlayer",
        templateData: {
          name: user.userName,
          roundName: roundData.name,
          roundUrl: `${env.BASE_URL}/rounds/${roundData.id}`,
        },
        emailDetails: {
          to: user.email,
          subject: `Registrierung in Warteliste ${roundData.name}!`,
        },
      };
      const response = await apiService.sendEmail(emailData);
      console.log("Email sent successfully:", response);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  async function sendEmailDataGm(roundData) {
    try {
      const emailData = {
        templateName: "registNewPlayerGm",
        templateData: {
          name: gameMaster.data.userName,
          playerName: user.userName,
          roundName: roundData.name,
          roundUrl: `${env.BASE_URL}/rounds/${roundData.id}`,
        },
        emailDetails: {
          to: gameMaster.data.email,
          subject: `Registrierung für Spielrunde ${roundData.name}!`,
        },
      };
      const response = await apiService.sendEmail(emailData);
      console.log("Email sent successfully:", response);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  async function sendUnregistEmailDataGm(roundData) {
    try {
      const emailData = {
        templateName: "unregistPlayerGm",
        templateData: {
          name: gameMaster.data.userName,
          playerName: user.userName,
          roundName: roundData.name,
          roundUrl: `${env.BASE_URL}/rounds/${roundData.id}`,
        },
        emailDetails: {
          to: gameMaster.data.email,
          subject: `Abmeldung von Spielrunde ${roundData.name}!`,
        },
      };
      const response = await apiService.sendEmail(emailData);
      console.log("Email sent successfully:", response);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  async function sendWaitinglistEmailDataGm(roundData) {
    try {
      const emailData = {
        templateName: "waitinglistPlayerGm",
        templateData: {
          name: gameMaster.data.userName,
          playerName: user.userName,
          roundName: roundData.name,
          roundUrl: `${env.BASE_URL}/rounds/${roundData.id}`,
        },
        emailDetails: {
          to: gameMaster.data.email,
          subject: `Registrierung in Warteliste ${roundData.name}!`,
        },
      };
      const response = await apiService.sendEmail(emailData);
      console.log("Email sent successfully:", response);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  async function sendWaitinglistUpdateEmailDataGm(roundData, oldPlayerName, newPlayerName) {
    try {
      const emailData = {
        templateName: "waitinglistUpdateGm",
        templateData: {
          name: gameMaster.data.userName,
          oldPlayerName: oldPlayerName.userName,
          newPlayerName: newPlayerName.userName,
          roundName: roundData.name,
          roundUrl: `${env.BASE_URL}/rounds/${roundData.id}`,
        },
        emailDetails: {
          to: gameMaster.data.email,
          subject: `Update Registrierung für Spielrunde ${roundData.name}!`,
        },
      };
      const response = await apiService.sendEmail(emailData);
      console.log("Email sent successfully:", response);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  const handleRegister = async () => {
    if (loadedSession === null) {
      router.push("/auth");
      return;
    }
    await registerPlayer(user.id, round.id, "registered");
    sendEmailDataPlayer(round);
    sendEmailDataGm(round);
    setRegisteredPlayersCount((prevCount) => prevCount + 1);
  };

  const handleAddToWaitlist = async () => {
    if (loadedSession === null) {
      router.push("/auth");
      return;
    }
    await registerPlayer(user.id, round.id, "waiting");
    sendWaitinglistEmailDataPlayer(round);
    sendWaitinglistEmailDataGm(round);
  };

  const handleButtonClick = async () => {
    setIsLoading(true);

    try {
      if (buttonLabel === "Abmelden") {
        await handleUnregister();
      } else if (buttonLabel === "Registrieren") {
        await handleRegister();
      } else if (buttonLabel === "Zur Warteliste hinzufügen") {
        await handleAddToWaitlist();
      }
    } catch (err) {
      console.error(err);
      // Possibly show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for delete button click
  const handleDelete = async () => {
    setDeleteGameRoundLoading(true);
    try {
      const data = await deleteGameRound(round.id);
      setDeleteGameRoundData(data);
    } catch (error) {
      setDeleteGameRoundError(error);
    } finally {
      setDeleteGameRoundLoading(false);
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

  const { displayStartDate, displayEndDate } = formatRoundDates(round);

  let buttonLabel = "";
  let buttonDisabled = false;

  if (playerRegistration && loadedSession) {
    buttonLabel = "Abmelden";
  } else if (
    round.registeredPlayersCount < round.playerLimit ||
    !round.playerLimit
  ) {
    buttonLabel = "Registrieren";
  } else if (round.waitingList) {
    buttonLabel = "Zur Warteliste hinzufügen";
  } else {
    buttonLabel = "Spielrunde ist voll";
    buttonDisabled = true;
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const displayRegisteredPlayersCount = () => {
    if (round.playerLimit > 0) {
      return (
        <InformationItem
          label="Spieler Anzahl"
          value={`${registeredPlayersCount} von ${round.playerLimit}`}
        />
      );
    }
    if (round.playerLimit == 0) {
      return (
        <InformationItem
          label="Spieler Anzahl"
          value={`${registeredPlayersCount} von Unbegrenzt`}
        />
      );
    } else {
      return null;
    }
  };

  return (
    <Card>
      <div className={styles.header}>
        <h2 className={styles.title}>{round.name}</h2>
        <InformationItem
          className={styles.gameMaster}
          label="Spielleiter"
          value={gameMaster.data.userName}
        />
        {loadedSession &&
          (user.id === round.gameMasterId || user.role == "admin") && (
            <ActionButtons
              loadedSession={loadedSession}
              user={user}
              ownerId={round.gameMasterId}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
            />
          )}
      </div>
      <div className={styles.content}>
        <div className={styles.informations}>
          <InformationItem
            label="Spieltype"
            value={capitalizeFirstLetter(round.gameType)}
          />
          <InformationItem label="System" value={round.gameSystem} />
          <div className={styles.genresContainer}>
            <label>
              <b>Genres:</b>
            </label>
            <div className={styles.genreContainer}>
              {round.GameRoundGenre.map((g) => (
                <span key={g.genre.id}>{g.genre.value}</span>
                
              ))}
            </div>
          </div>
          <InformationItem
            label="Altersempfehlung"
            value={`${round.recommendedAge} Jahre`}
          />
          {displayRegisteredPlayersCount()}
          <InformationItem label="Beginn" value={`${displayStartDate} Uhr`} />
          <InformationItem label="Ende" value={`${displayEndDate} Uhr`} />
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
      <RegisteredPlayers players={players} waitingList={waitingList} />
    </Card>
  );
}

export default DeteilRoundPage;

export async function getServerSideProps(context) {
  const { id } = context.params; // Extract the round ID from the context

  try {
    const sessionGet = await getSession({ req: context.req });
    const user = sessionGet?.user || null;

    const round = await getGameRound(id);
    
    // Fetch gameMaster details
    const gameMaster = await getUser(round.gameMasterId);

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
