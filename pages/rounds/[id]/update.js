// React and Hooks
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSessionApp from "@/hooks/useSessionApp";

// Data Validation and Schema
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Next.js and Authentication
import { getSession } from "next-auth/react";

// Date utilities
import { formatISO } from "date-fns";

// API and Networking
import {
  deleteGameRound,
  getGameRound,
  updateGameRound,
} from "@/lib/rounds/roundsService";
import { getUser } from "@/lib/user/userService";
import { getEvent } from "@/lib/event/eventService";

// Configuration and Helpers
import { env } from "@/helpers/env";
import { formatToUserTimezone } from "@/helpers/dateFormatter";

// Components and Styles
import Card from "@/components/shared/card/card";
import ActionButtons from "@/components/shared/actionButton/actionButton";
import styles from "./UpdateRound.module.css";
import ButtonGroup from "@/components/shared/actionButton/buttonGroupComponent";
import { getGenre } from "@/lib/rounds/genreService";
import MultiSelectModal from "@/components/shared/modal/multiSelectModal";
import TextInput from "@/components/shared/intput/textInput";
import TextArea from "@/components/shared/intput/textArea";
import Dropdown from "@/components/shared/intput/dropdown";
import NumberInput from "@/components/shared/intput/numberInput";
import Togglebox from "@/components/shared/intput/togglebox";
import GenresFormField from "@/components/rounds/genresFormField";
import TimeSlotSelector from "@/components/rounds/timeSlotSelector";
import StartTimeEndTimePicker from "@/components/rounds/startTimeEndTimePicker";

// Define validation schema with Yup
const schema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string(),
  startTime: Yup.date().required(),
  endTime: Yup.date().required(),
  gameType: Yup.string().required(),
  gameSystem: Yup.string().nullable(),
  genre: Yup.string(),
  recommendedAge: Yup.number().positive().min(0),
  playerLimit: Yup.number().required().positive().min(0),
  waitingList: Yup.bool().required(),
});

function UpdateGameRoundPage({
  roundId,
  gameMaster,
  user,
  eventTimeSlots,
  genres,
}) {
  const router = useRouter();

  const { isSessionLoading, loadedSession } = useSessionApp();
  const [deleteGameRoundLoading, setDeleteGameRoundLoading] = useState(false);
  const [deleteGameRoundData, setDeleteGameRoundData] = useState(null);
  const [deleteGameRoundError, setDeleteGameRoundError] = useState(null);

  const [isModalOpen, setModalOpen] = useState(false);

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [gameRound, setGameRound] = useState([]);
  const [gameRoundName, setGameRoundName] = useState("");
  const [timeSlots, setTimeSlots] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    async function fetchGameRound() {
      const gameRound = await getGameRound(roundId);
      setGameRound(gameRound);
      setSelectedGenres(gameRound.genres);
      setGameRoundName(gameRound.name);

      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // Convert the dates to the user's timezone and format them
      const startTime = formatToUserTimezone(gameRound.startTime, userTimezone);
      const endTime = formatToUserTimezone(gameRound.endTime, userTimezone);

      setStartTime(startTime);
      setEndTime(endTime);

      if (eventTimeSlots) {
        const timeSlotsArray = Object.keys(eventTimeSlots).map((key) => {
          const { start, end } = eventTimeSlots[key];
          return {
            value: `${start}-${end}`,
            label: `Von ${formatDateTime(start)} bis ${formatDateTime(end)}`,
          };
        });

        setTimeSlots(timeSlotsArray);
        setSelectedTimeSlot(`${startTime}-${endTime}`);
      }
    }

    fetchGameRound();
  }, [roundId]);

  const onSubmit = async (data) => {
    data.preventDefault();

    if (selectedTimeSlot) {
      const regex =
        /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})-(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/;
      const match = selectedTimeSlot.match(regex);
      gameRound.startTime = formatISO(new Date(match[1]));
      gameRound.endTime = formatISO(new Date(match[2]));
    } else {
      gameRound.startTime = formatISO(new Date(startTime));
      gameRound.endTime = formatISO(new Date(endTime));
    }

    schema
      .validate(gameRound, {
        abortEarly: false, // Prevent aborting validation after first error
      })
      .catch((err) => {
        const errors = err.inner.reduce((acc, error) => {
          return {
            ...acc,
            [error.path]: true,
          };
        }, {});
        setErrors(errors);
      });

    if (!schema.isValidSync(gameRound)) {
      return;
    }

    if (selectedGenres.length > 0) {
      gameRound.genres = selectedGenres.map((genre) => genre.code).join(",");
    } else {
      gameRound.genres = null;
    }

    const payload = {
      eventId: gameRound.eventId,
      gameMasterId: gameRound.gameMasterId,
      name: gameRound.name,
      description: gameRound.description,
      gameType: gameRound.gameType,
      gameSystem: gameRound.gameSystem,
      genres: gameRound.genres,
      recommendedAge: +gameRound.recommendedAge,
      startTime: gameRound.startTime,
      endTime: gameRound.endTime,
      playerLimit: +gameRound.playerLimit,
      waitingList: gameRound.waitingList,
      extraDetails: gameRound.extraDetails,
    };

    console.log(payload);
    updateGameRound(roundId, payload);
    router.push(`${env.BASE_URL}/rounds/${roundId}`);
  };

  // Handler for delete button click
  const handleDelete = async () => {
    setDeleteGameRoundLoading(true);
    try {
      const data = await deleteGameRound(gameRound?.id);
      setDeleteGameRoundData(data);
    } catch (error) {
      setDeleteGameRoundError(error);
    } finally {
      setDeleteGameRoundLoading(false);
    }
  };

  const handleCancel = async (event) => {
    event.preventDefault();
    router.push(`${env.BASE_URL}/rounds/${roundId}`);
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

  function formatDateTime(dateTimeString) {
    const dateObj = new Date(dateTimeString);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  // console.log(selectedGenres.map((genre) => genre.code));

  function handleDeleteGenre(genreToDelete) {
    setSelectedGenres(
      selectedGenres.filter((genre) => genre.code !== genreToDelete.code)
    );
  }

  return (
    <Card>
      {isModalOpen && (
        <MultiSelectModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          options={genres}
          initialSelectedOptions={selectedGenres}
          onChange={setSelectedGenres}
        />
      )}
      <div className={styles.header}>
        <h2 className={styles.title}>Update Spielrunde {gameRoundName}</h2>
        <ActionButtons
          loadedSession={loadedSession}
          user={user}
          ownerId={gameRound?.gameMasterId}
          handleDelete={handleDelete}
        />
      </div>
      <div className={styles.content}>
        <form className={styles.form} onSubmit={onSubmit}>
          {loadedSession && user.role == "admin" && (
            <>
              <TextInput
                label="UUID"
                value={gameRound.id}
                readOnly={true}
                disable={true}
              />
              <TextInput
                label="Event ID"
                value={gameRound.eventId}
                disable={true}
              />
              <TextInput
                label="Spielleiter ID"
                value={gameRound.gameMasterId}
                disable={true}
              />
            </>
          )}
          <TextInput
            label="Title"
            value={gameRound.name}
            onChange={(event) =>
              setGameRound({ ...gameRound, name: event.target.value })
            }
            error={errors.name ? "Runden Title wird benötigt!" : null}
          />
          <TextArea
            label="Beschreibung"
            value={gameRound.description}
            onChange={(event) =>
              setGameRound({ ...gameRound, description: event.target.value })
            }
          />
          <Dropdown
            label="Spieltyp"
            options={[
              { value: "roleplay", label: "Roleplay" },
              { value: "boardgame", label: "Boardgame" },
              { value: "cardgame", label: "Cardgame" },
              { value: "other", label: "Other" },
            ]}
            value={gameRound.gameType}
            onChange={(event) =>
              setGameRound({ ...gameRound, gameType: event.target.value })
            }
          />
          <TextInput
            label="Spiel System"
            value={gameRound.gameSystem}
            onChange={(event) =>
              setGameRound({ ...gameRound, gameSystem: event.target.value })
            }
          />
          <GenresFormField
            selectedGenres={selectedGenres}
            handleDeleteGenre={handleDeleteGenre}
            setModalOpen={setModalOpen}
          />
          <NumberInput
            label="Empfohlenes Alter"
            value={gameRound.recommendedAge}
            onChange={(event) =>
              setGameRound({
                ...gameRound,
                recommendedAge: event.target.value,
              })
            }
            error={
              errors.recommendedAge
                ? "Empfolenes Alter darf nicht negativ sein!"
                : null
            }
          />
          <NumberInput
            label="Spieler Limit"
            value={gameRound.playerLimit}
            onChange={(event) =>
              setGameRound({ ...gameRound, playerLimit: event.target.value })
            }
            error={
              errors.playerLimit
                ? "Spieler limit darf nicht negativ sein!"
                : null
            }
          />
          {timeSlots?.length > 0 ? (
            <TimeSlotSelector
              timeSlots={timeSlots}
              selectedTimeSlot={selectedTimeSlot}
              onSelectTimeSlot={(event) =>
                setSelectedTimeSlot(event.target.value)
              }
            />
          ) : (
            <StartTimeEndTimePicker
              startTime={startTime}
              endTime={endTime}
              onSelectStartTime={(event) => setStartTime(event.target.value)}
              onSelectEndTime={(event) => setEndTime(event.target.value)}
            />
          )}

          <Togglebox
            label="Warteliste"
            checked={gameRound.waitingList}
            onChange={(event) =>
              setGameRound({ ...gameRound, waitingList: event.target.checked })
            }
          />
          <ButtonGroup
            handleCancel={handleCancel}
            saveButtonText="Runde aktualisieren"
            cancelButtonText="Abbrechen"
          />
        </form>
      </div>
    </Card>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params; // Extract the round ID from the context
  const roundId = id;

  try {
    // Get the user from the session
    const sessionGet = await getSession({ req: context.req });
    const user = sessionGet?.user || null;

    // Fetch round details
    const round = await getGameRound(roundId);

    // Fetch gameMaster details
    const gameMaster = await getUser(round.gameMasterId);

    // Fetch event time slots
    let eventTimeSlots = null;
    if (round.eventId != null) {
      const event = await getEvent(round.eventId);
      eventTimeSlots = event.timeSlots;
    }

    // Fetch genres
    const genres = await getGenre();

    // If the user is the game master or an admin, return the round details
    if (user?.id === round.gameMasterId || user?.role == "admin") {
      return {
        props: {
          roundId,
          gameMaster,
          user,
          eventTimeSlots,
          genres,
        },
      };
    }
    // If the user is a player, redirect to the player page
    else if (user != null) {
      return {
        redirect: {
          destination: "/rounds/[id]/player",
          permanent: false,
        },
      };
    }
    // Otherwise, redirect to the login page
    else {
      return {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      };
    }
  } catch (error) {
    // Log any errors and return a 404 page
    console.error("Error fetching data:", error);
    return {
      notFound: true,
    };
  }
}

export default UpdateGameRoundPage;
