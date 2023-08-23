// React and Hooks
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSessionApp from "@/hooks/useSessionApp";
import { useForm, Controller } from "react-hook-form";

// Data Validation and Schema
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Next.js and Authentication
import { getSession } from "next-auth/react";

// Date utilities
import { formatISO } from "date-fns";
import { DateTime, Settings } from "luxon";

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

function UpdateGameRoundPage({ roundId, gameMaster, user, eventTimeSlots }) {
  const router = useRouter();

  const hasTimeSlots =
    eventTimeSlots && Object.values(eventTimeSlots)[0].start !== "";

  const { isSessionLoading, loadedSession } = useSessionApp();
  const [deleteGameRoundLoading, setDeleteGameRoundLoading] = useState(false);
  const [deleteGameRoundData, setDeleteGameRoundData] = useState(null);
  const [deleteGameRoundError, setDeleteGameRoundError] = useState(null);

  const { reset, register, handleSubmit, control, errors } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: "",
      eventId: "",
      gameMasterId: "",
      name: "",
      description: "",
      gameType: "",
      gameSystem: "",
      genre: "",
      recommendedAge: "",
      timeSlot: null,
      startTime: "",
      endTime: "",
      playerLimit: 0,
      waitingList: false,
      extraDetails: null,
    },
  });

  const [gameRound, setGameRound] = useState(null);

  useEffect(() => {
    async function fetchGameRound() {
      const gameRound = await getGameRound(roundId);
      setGameRound(gameRound);
    }

    fetchGameRound();
  }, [roundId]);

  useEffect(() => {
    if (gameRound) {
      const formattedGameRound = { ...gameRound };

      // Get user's timezone
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Convert the dates to the user's timezone and format them
      formattedGameRound.startTime = formatToUserTimezone(
        gameRound.startTime,
        userTimezone
      );
      formattedGameRound.endTime = formatToUserTimezone(
        gameRound.endTime,
        userTimezone
      );

      if (
        eventTimeSlots &&
        formattedGameRound.startTime &&
        formattedGameRound.endTime
      ) {
        formattedGameRound.timeSlot = `${formattedGameRound.startTime}-${formattedGameRound.endTime}`;
      }

      reset(formattedGameRound); // Reset form with the fetched data
    }
  }, [gameRound, reset]);

  const onSubmit = async (data) => {
    if (data.timeSlot) {
      const regex =
        /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})-(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/;
      const match = data.timeSlot.match(regex);
      data.startTime = match[1];
      data.endTime = match[2];
    }
    const payload = {
      eventId: data.eventId,
      gameMasterId: data.gameMasterId,
      name: data.name,
      description: data.description,
      gameTypeString: data.gameTypeString,
      gameSystem: data.gameSystem,
      genre: data.genre,
      recommendedAge: data.recommendedAge,
      startTime: formatISO(new Date(data.startTime)),
      endTime: formatISO(new Date(data.endTime)),
      playerLimit: data.playerLimit,
      waitingList: data.waitingList,
      extraDetails: data.extraDetails,
    };

    try {
      await updateGameRound(gameRound?.id, payload);
    } catch (err) {
      console.error(err);
    }
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

  return (
    <Card>
      <div className={styles.header}>
        <h2 className={styles.title}>Update Spielrunde {gameRound?.name}</h2>
        <ActionButtons
          loadedSession={loadedSession}
          user={user}
          ownerId={gameRound?.gameMasterId}
          handleDelete={handleDelete}
        />
      </div>
      <div className={styles.content}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <label className={styles.label}>
            ID:
            <Controller
              control={control}
              name="id"
              render={({ field }) => (
                <input className={styles.input} {...field} readOnly />
              )}
            />
            {errors?.id && (
              <p className={styles.error}>This field is required</p>
            )}
          </label>
          <label className={styles.label}>
            Event ID:
            <Controller
              control={control}
              name="eventId"
              render={({ field }) => (
                <input className={styles.input} {...field} />
              )}
            />
            {errors?.eventId && (
              <p className={styles.error}>This field is required</p>
            )}
          </label>
          <label className={styles.label}>
            Game Master Id:
            <Controller
              control={control}
              name="gameMasterId"
              render={({ field }) => (
                <input className={styles.input} {...field} />
              )}
            />
            {errors?.gameMasterId && (
              <p className={styles.error}>This field is required</p>
            )}
          </label>
          <label className={styles.label}>
            Name:
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <input className={styles.input} {...field} />
              )}
            />
            {errors?.name && (
              <p className={styles.error}>This field is required</p>
            )}
          </label>
          <label className={styles.label}>
            Description:
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  {...field}
                />
              )}
            />
            {errors?.description && (
              <p className={styles.error}>This field is required</p>
            )}
          </label>
          <label className={styles.label}>
            gameType:
            <Controller
              control={control}
              name="gameType"
              render={({ field }) => (
                <input className={styles.input} {...field} />
              )}
            />
            {errors?.gameType && (
              <p className={styles.error}>This field is required</p>
            )}
          </label>
          <label className={styles.label}>
            gameSystem:
            <Controller
              control={control}
              name="gameSystem"
              render={({ field }) => (
                <input className={styles.input} {...field} />
              )}
            />
            {errors?.gameSystem && (
              <p className={styles.error}>This field is required</p>
            )}
          </label>
          <label className={styles.label}>
            genre:
            <Controller
              control={control}
              name="genre"
              render={({ field }) => (
                <input className={styles.input} {...field} />
              )}
            />
            {errors?.genre && (
              <p className={styles.error}>This field is required</p>
            )}
          </label>
          <label className={styles.label}>
            recommendedAge:
            <Controller
              control={control}
              name="recommendedAge"
              render={({ field }) => (
                <input className={styles.input} {...field} />
              )}
            />
            {errors?.recommendedAge && (
              <p className={styles.error}>This field is required</p>
            )}
          </label>
          <label className={styles.label}>
            playerLimit:
            <Controller
              control={control}
              name="playerLimit"
              render={({ field }) => (
                <input className={styles.input} {...field} />
              )}
            />
            {errors?.playerLimit && (
              <p className={styles.error}>This field is required</p>
            )}
          </label>
          {hasTimeSlots ? (
            <label className={styles.label}>
              Timeslots:
              <Controller
                control={control}
                name="timeSlot"
                onChange={(option) => {
                  field.onChange(option.value);
                }}
                render={({ field }) => (
                  <select {...field}>
                    {Object.values(eventTimeSlots).map((slot, index) => (
                      <option key={index} value={`${slot.start}-${slot.end}`}>
                        {`Slot ${index + 1}: von ${slot.start} bis ${slot.end}`}
                      </option>
                    ))}
                  </select>
                )}
              />
            </label>
          ) : (
            <>
              <label className={styles.label}>
                Start Time:
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <input
                      className={styles.input}
                      type="datetime-local"
                      {...field}
                    />
                  )}
                />
              </label>
              <label className={styles.label}>
                End Time:
                <Controller
                  name="endTime"
                  control={control}
                  defaultValue={gameRound?.endTime}
                  render={({ field }) => (
                    <input
                      className={styles.input}
                      type="datetime-local"
                      {...field}
                    />
                  )}
                />
              </label>
            </>
          )}
          <div className={styles.toggleWithLabel}>
            <span className={styles.toggleLabelText}>Warteliste</span>
            <label className={styles.toggleContainer}>
              <Controller
                control={control}
                name="waitingList"
                render={({ field }) => (
                  <>
                    <input
                      type="checkbox"
                      className={styles.toggleInput}
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </>
                )}
              />
              {errors?.waitingList && (
                <p className={styles.error}>This field is required</p>
              )}
            </label>
          </div>
          {/* <label className={styles.label}>
            extraDetails:
            <Controller
              control={control}
              name="extraDetails"
              render={({ field }) => (
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  {...field}
                />
              )}
            />
            {errors?.extraDetails && (
              <p className={styles.error}>This field is required</p>
            )}
          </label> */}
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

    if (user?.id === round.gameMasterId || user?.role == "admin") {
      return {
        props: {
          roundId,
          gameMaster,
          user,
          eventTimeSlots,
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
