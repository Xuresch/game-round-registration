// React and Hooks
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSessionApp from "@/hooks/useSessionApp";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

// Data Validation and Schema
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Next.js and Authentication
import { getSession } from "next-auth/react";

// Date utilities
import { compareAsc, formatISO, set } from "date-fns";

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
import { is } from "date-fns/locale";
import { getAbsoluteFSPath } from "swagger-ui-dist";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import TextInput from "@/components/shared/intput/textInput";
import TextArea from "@/components/shared/intput/textArea";
import Dropdown from "@/components/shared/intput/dropdown";
import NumberInput from "@/components/shared/intput/numberInput";
import Togglebox from "@/components/shared/intput/togglebox";
import GenresFormField from "@/components/rounds/genresFormField";

// Define validation schema with Yup
const schema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string(),
  startTime: Yup.date().required(),
  endTime: Yup.date().required(),
  gameType: Yup.string().required(),
  gameSystem: Yup.string(),
  genre: Yup.string(),
  recommendedAge: Yup.number(),
  playerLimit: Yup.number().required(),
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

  const hasTimeSlots =
    eventTimeSlots && Object.values(eventTimeSlots)[0].start !== "";

  const { isSessionLoading, loadedSession } = useSessionApp();
  const [deleteGameRoundLoading, setDeleteGameRoundLoading] = useState(false);
  const [deleteGameRoundData, setDeleteGameRoundData] = useState(null);
  const [deleteGameRoundError, setDeleteGameRoundError] = useState(null);

  const [isModalOpen, setModalOpen] = useState(false);

  const [selectedGenres, setSelectedGenres] = useState([]);

  // const { reset, register, handleSubmit, control, errors, watch, setValue } =
  //   useForm({
  //     resolver: yupResolver(schema),
  //     defaultValues: {
  //       id: "",
  //       eventId: "",
  //       gameMasterId: "",
  //       name: "",
  //       description: "",
  //       gameType: "",
  //       gameSystem: "",
  //       genres: [],
  //       recommendedAge: "",
  //       timeSlot: null,
  //       startTime: "",
  //       endTime: "",
  //       playerLimit: 0,
  //       waitingList: false,
  //       extraDetails: null,
  //     },
  //   });
  const [gameRound, setGameRound] = useState([]);
  const [gameRoundName, setGameRoundName] = useState("");

  const handleSubmit = (data) => {
    console.log(data);
  };

  useEffect(() => {
    async function fetchGameRound() {
      const gameRound = await getGameRound(roundId);
      setGameRound(gameRound);
      setSelectedGenres(gameRound.genres);
      setGameRoundName(gameRound.name);
    }
    fetchGameRound();
  }, [roundId]);

  // console.log(selectedGenres);
  // console.log(genres);

  // useEffect(() => {
  //   if (gameRound) {
  //     const formattedGameRound = { ...gameRound };

  //     // Get user's timezone
  //     const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  //     // Convert the dates to the user's timezone and format them
  //     formattedGameRound.startTime = formatToUserTimezone(
  //       gameRound.startTime,
  //       userTimezone
  //     );
  //     formattedGameRound.endTime = formatToUserTimezone(
  //       gameRound.endTime,
  //       userTimezone
  //     );

  //     if (
  //       eventTimeSlots &&
  //       formattedGameRound.startTime &&
  //       formattedGameRound.endTime
  //     ) {
  //       formattedGameRound.timeSlot = `${formattedGameRound.startTime}-${formattedGameRound.endTime}`;
  //     }

  //     reset(formattedGameRound); // Reset form with the fetched data
  //   }
  // }, [gameRound, reset]);

  // const onSubmit = async (data) => {
  //   console.log(data);
  //   if (data.timeSlot) {
  //     const regex =
  //       /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})-(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/;
  //     const match = data.timeSlot.match(regex);
  //     data.startTime = match[1];
  //     data.endTime = match[2];
  //   }

  //   const payload = {
  //     eventId: data.eventId,
  //     gameMasterId: data.gameMasterId,
  //     name: data.name,
  //     description: data.description,
  //     gameTypeString: data.gameTypeString,
  //     gameSystem: data.gameSystem,
  //     genres: data.genres.map((genre) => genre.value).join(","),
  //     // genres: data.genres.join(","),
  //     recommendedAge: data.recommendedAge,
  //     startTime: formatISO(new Date(data.startTime)),
  //     endTime: formatISO(new Date(data.endTime)),
  //     playerLimit: data.playerLimit,
  //     waitingList: data.waitingList,
  //     extraDetails: data.extraDetails,
  //   };

  //   try {
  //     await updateGameRound(gameRound?.id, payload);
  //   } catch (err) {
  //     console.error(err);
  //   }
  //   // router.push(`${env.BASE_URL}/rounds/${roundId}`);
  // };

  const onSubmit = async (data) => {
    data.preventDefault();
    console.log(data);

    const payload = {
      eventId: gameRound.eventId,
      gameMasterId: gameRound.gameMasterId,
      name: gameRound.name,
      description: gameRound.description,
      gameType: gameRound.gameType,
      gameSystem: gameRound.gameSystem,
      genres: selectedGenres.map((genre) => genre.code).join(","),
      recommendedAge: gameRound.recommendedAge,
      startTime: gameRound.startTime,
      endTime: gameRound.endTime,
      playerLimit: gameRound.playerLimit,
      waitingList: gameRound.waitingList,
      extraDetails: gameRound.extraDetails,
    };

    console.log(payload);
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

  console.log("gameRound:", gameRound);

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
          <TextInput
            label="Title"
            value={gameRound.name}
            onChange={(event) =>
              setGameRound({ ...gameRound, name: event.target.value })
            }
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
          <TextInput label="Spiel System" value={gameRound.gameSystem} />
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
          />
          <NumberInput
            label="Spieler Limit"
            value={gameRound.playerLimit}
            onChange={(event) =>
              setGameRound({ ...gameRound, playerLimit: event.target.value })
            }
          />
          <div>Timeslot and datepicer</div>
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
    const sessionGet = await getSession({ req: context.req });
    const user = sessionGet?.user || null;

    // Fetch round details
    const round = await getGameRound(roundId);

    // Fetch gameMaster details
    const gameMaster = await getUser(round.gameMasterId);

    const event = await getEvent(round.eventId);
    const eventTimeSlots = event.timeSlots;

    const genres = await getGenre();
    console.log(genres);
    console.log(round);

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
    } else {
      return {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      notFound: true, // This will return a 404 page
    };
  }
}

export default UpdateGameRoundPage;
