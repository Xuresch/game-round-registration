// pages/rounds/[id]/index.js
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

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
  const [registeredPlayersCount, setRegisteredPlayersCount] = useState(round.registeredPlayersCount);
  const [players, setPlayers] = useState([]);
  const [waitingList, setWaitingList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Berechnung verfügbarer Plätze (Spielerlimit minus reservierte Vor-Ort Plätze)
  const availableSpots = round.playerLimit - (round.reservedOnSiteSeats || 0);
  const spotsLeft = availableSpots - registeredPlayersCount;

  const updatePlayerRegistrations = async () => {
    const registration = await getPlayerRegistration(user?.id, round.id);
    setPlayerRegistration(registration);
    const players = await getRegisteredPlayers(round.id);
    setPlayers(players);
    const waitingList = await getWaitingPlayers(round.id);
    setWaitingList(waitingList);
    setRegisteredPlayersCount(players.length);
  };

  useEffect(() => {
    async function fetchPlayerRegistration() {
      await updatePlayerRegistrations();
    }
    fetchPlayerRegistration();
  }, [isLoading, round.id, user]);

  const handleUnregister = async () => {
    await deletePlayerRegistration(playerRegistration.id);
    const oldestWaitingPlayer = await promoteOldestWaitingPlayer(round);
    await updatePlayerRegistrations();
    if (oldestWaitingPlayer) {
      sendEmailDataPlayer(round, oldestWaitingPlayer.Player);
      sendWaitinglistUpdateEmailDataGm(round, user, oldestWaitingPlayer.Player);
      sendUnregistEmailDataPlayer(round);
    } else {
      sendUnregistEmailDataPlayer(round);
      sendUnregistEmailDataGm(round);
    }
  };

  async function sendEmailDataPlayer(roundData, userData = user) {
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
    await updatePlayerRegistrations();
  };

  const handleAddToWaitlist = async () => {
    if (loadedSession === null) {
      router.push("/auth");
      return;
    }
    await registerPlayer(user.id, round.id, "waiting");
    sendWaitinglistEmailDataPlayer(round);
    sendWaitinglistEmailDataGm(round);
    await updatePlayerRegistrations();
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
    } finally {
      setIsLoading(false);
    }
  };

  let buttonLabel = "";
  let buttonDisabled = false;
  if (playerRegistration && loadedSession) {
    buttonLabel = "Abmelden";
  } else if (round.registeredPlayersCount < availableSpots || !round.playerLimit) {
    buttonLabel = "Registrieren";
  } else if (round.waitingList) {
    buttonLabel = "Zur Warteliste hinzufügen";
  } else {
    buttonLabel = "Spielrunde ist voll";
    buttonDisabled = true;
  }
  if (round.isOnSiteOnlyRegistration) {
    buttonDisabled = true;
    buttonLabel = "Nur vor Ort Anmeldung";
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const displayRegisteredPlayersCount = () => {
    let countContent;
    if (round.playerLimit > 0) {
      countContent = (
        <>
          {registeredPlayersCount} von {round.playerLimit}
        </>
      );
    } else if (round.playerLimit === 0) {
      countContent = (
        <>
          {registeredPlayersCount} von Unbegrenzt
        </>
      );
    }
    if (round.reservedOnSiteSeats > 0) {
      countContent = (
        <>
          {countContent}{", "}
          <span style={{ color: "#d32f2f" }}>
            {round.reservedOnSiteSeats} für vor Ort reserviert!
          </span>
        </>
      );
    }
    if (round.isOnSiteOnlyRegistration) {
      countContent = (
        <><span style={{ color: "#d32f2f" }}>
            {round.playerLimit} für vor Ort reserviert!
      </span></>)
    }
    return <InformationItem label="Spieler Anzahl" value={countContent} />;
  };

  const { displayStartDate, displayEndDate } = formatRoundDates(round);

  return (
    <Card>
      <div className={styles.header}>

        <h2 className={styles.title}>{round.name}</h2>
        {spotsLeft === 0 ? (
            <div className={`${styles.badge} ${styles.badgeFull}`}>Spielrunde ist Voll!</div>
          ) : spotsLeft <= availableSpots / 2 ? (
            <div className={`${styles.badge} ${styles.badgeFew}`}>
              Nur noch wenige Plätze verfügbar!
            </div>
          ) : null}
        <InformationItem
          className={styles.gameMaster}
          label="Spielleiter"
          value={gameMaster.data.userName}
        />
        {loadedSession &&
          (user.id === round.gameMasterId || user.role === "admin") && (
            <ActionButtons
              loadedSession={loadedSession}
              user={user}
              ownerId={round.gameMasterId}
              handleUpdate={() =>
                router.push(`${env.BASE_URL}/rounds/${round.id}/update`)
              }
              handleDelete={() => {
                setDeleteGameRoundLoading(true);
                deleteGameRound(round.id)
                  .then((data) => setDeleteGameRoundData(data))
                  .catch((error) => setDeleteGameRoundError(error))
                  .finally(() => setDeleteGameRoundLoading(false));
              }}
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
          className={`${styles.button} ${styles.save} ${buttonDisabled ? styles.disabled : ""}`}
          onClick={handleButtonClick}
          disabled={buttonDisabled || isLoading}
        >
          {isLoading ? "Laden..." : buttonLabel}
        </button>
      </div>
      <RegisteredPlayers players={players} waitingList={waitingList} />
    </Card>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  try {
    const sessionGet = await getSession({ req: context.req });
    const user = sessionGet?.user || null;
    const round = await getGameRound(id);
    const gameMaster = await getUser(round.gameMasterId);
    return {
      props: { round, gameMaster, user },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      notFound: true,
    };
  }
}

export default DeteilRoundPage;
