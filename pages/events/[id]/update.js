// pages/events/[id]/update.js
import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useApiRequest } from "@/hooks/useApiRequest";
import { useRouter } from "next/router";
import { env } from "@/helpers/env";
import Card from "@/components/shared/card/card";
import styles from "./UpdateEvent.module.css";
import { formatISO } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import Select from "react-select";
import ButtonGroup from "@/components/shared/actionButton/buttonGroupComponent";

// Neues Feld in das Validierungsschema einfügen
const schema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
  startDate: Yup.date().required(),
  endDate: Yup.date().required(),
  reservedOnSiteSeats: Yup.number().min(0, "Wert muss ≥ 0 sein"),
});

const customStyles = {
  container: (provided) => ({
    ...provided,
    ...styles.selectContainer,
  }),
  control: (provided, state) => ({
    ...provided,
    ...styles.selectControl,
    "&:hover": state.isFocused ? styles.selectControlHover : {},
  }),
  option: (provided, state) => ({
    ...provided,
    ...styles.selectOption,
    "&:hover": state.isSelected ? styles.selectOptionHover : {},
  }),
};

function UpdateEventPage({ eventId }) {
  const router = useRouter();

  const { data: users } = useApiRequest(
    `${env.BASE_API_URL}/users?role=admin&role=organizer`
  );

  const {
    data: event,
    loading: eventLoading,
    error: eventError,
  } = useApiRequest(`${env.BASE_API_URL}/events/${eventId}`);

  const {
    fetchData: updateEvent,
    data: updatedEventData,
    loading: updateEventLoading,
    error: updateEventError,
  } = useApiRequest(
    `${env.BASE_API_URL}/events/${eventId}`,
    "PUT",
    null,
    false
  );

  const {
    fetchData: deleteEvent,
    data: deleteEventData,
    loading: deleteEventLoading,
    error: deleteEventError,
  } = useApiRequest(`${env.BASE_API_URL}/events/${eventId}`, "DELETE", false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      organizerId: "",
      timeSlots: [{ start: "", end: "" }],
      reservedOnSiteSeats: 0,
    },
  });

  const userOptions = users?.map((user) => ({
    value: user.id,
    label: user.userName || user.email,
  }));

  const defaultOrganizer = userOptions?.find(
    (user) => user.value === event?.organizerId
  );

  const [selectedUser, setSelectedUser] = useState(defaultOrganizer);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "timeSlots",
  });

  // Helper zur Umrechnung in die Nutzerzeitzone
  function formatToUserTimezone(dateStr, timezone) {
    const date = utcToZonedTime(dateStr, timezone);
    return (
      formatISO(date, { representation: "date" }) +
      "T" +
      formatISO(date, { representation: "time" }).slice(0, 5)
    );
  }

  const [isLoading, setIsLoading] = useState(true); // Local state für Ladeanzeige
  const [loadedSession, setLoadedSession] = useState(null); // Session-Daten
  const [user, setUser] = useState(null); // Aktueller User

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

  // Beim Laden des Events die Formulardaten zurücksetzen
  useEffect(() => {
    if (event) {
      const formattedEvent = { ...event };

      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      formattedEvent.startDate = formatToUserTimezone(event.startDate, userTimezone);
      formattedEvent.endDate = formatToUserTimezone(event.endDate, userTimezone);
      formattedEvent.timeSlots = jsonToArray(event.timeSlots);

      reset(formattedEvent);
    }
  }, [event, reset]);

  function arrayToJson(timeSlots) {
    return timeSlots.reduce((json, slot, index) => {
      json[`slot_${index + 1}`] = slot;
      return json;
    }, {});
  }

  function jsonToArray(json) {
    if (!json) {
      return [{ start: "", end: "" }];
    }
    return Object.values(json);
  }

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      description: data.description,
      startDate: formatISO(new Date(data.startDate)),
      endDate: formatISO(new Date(data.endDate)),
      organizerId: data.organizerId,
      timeSlots: arrayToJson(data.timeSlots),
      reservedOnSiteSeats: data.reservedOnSiteSeats, // Neues Feld in den Payload aufnehmen
    };
    try {
      await updateEvent(payload);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (event) => {
    event.preventDefault();
    router.push(`${env.BASE_URL}/events/${eventId}`);
  };

  const handleDelete = async () => {
    try {
      await deleteEvent();
    } catch (err) {
      console.error("Failed to delete event:", err);
    }
  };

  useEffect(() => {
    if (!deleteEventLoading && !deleteEventError && deleteEventData) {
      router.push(`${env.BASE_URL}/events`);
    }
  }, [deleteEventLoading, deleteEventError, deleteEventData]);

  useEffect(() => {
    if (!updateEventLoading && !updateEventError && updatedEventData) {
      router.push(`${env.BASE_URL}/events/${eventId}`);
    }
  }, [updateEventLoading, updateEventError, updatedEventData]);

  if (eventLoading) {
    return <p>Loading...</p>;
  }

  if (eventError) {
    return <p>Error: {eventError.message}</p>;
  }

  return (
    <Card>
      <div className={styles.header}>
        <h2 className={styles.title}>Update Event {event.name}</h2>
        <div className={styles.links}>
          <button
            onClick={handleDelete}
            className={`${styles.button} ${styles.cancel}`}
          >
            <FontAwesomeIcon icon={faTrashCan} size="lg" />
          </button>
        </div>
      </div>
      <div className={styles.content}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {loadedSession && user.role == "admin" && (
            <label className={styles.label}>
              ID:
              <Controller
                control={control}
                name="id"
                render={({ field }) => (
                  <input className={styles.input} {...field} readOnly />
                )}
              />
              {errors.id && (
                <p className={styles.error}>This field is required</p>
              )}
            </label>
          )}

          {loadedSession && user.role == "admin" && (
            <label className={styles.label}>
              Organizer:
              <Controller
                control={control}
                name="organizerId"
                render={({ field }) => (
                  <Select
                    styles={customStyles}
                    key={event.organizerId}
                    {...field}
                    options={userOptions}
                    isSearchable={true}
                    placeholder={`${
                      selectedUser?.label || defaultOrganizer?.label
                    }: ${selectedUser?.value || defaultOrganizer?.value}`}
                    onChange={(option) => {
                      field.onChange(option.value);
                      setSelectedUser(option);
                    }}
                    defaultValue={defaultOrganizer?.label}
                  />
                )}
              />
              {errors.organizerId && (
                <p className={styles.error}>Organizer ID is required</p>
              )}
            </label>
          )}

          <label className={styles.label}>
            Name:
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <input className={styles.input} {...field} />
              )}
            />
            {errors.name && <p className={styles.error}>Name is required</p>}
          </label>

          <label className={styles.label}>
            Description:
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <textarea className={`${styles.input} ${styles.textarea}`} {...field} />
              )}
            />
            {errors.description && (
              <p className={styles.error}>Description is required</p>
            )}
          </label>

          <label className={styles.label}>
            Start Date:
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <input className={styles.input} type="datetime-local" {...field} />
              )}
            />
            {errors.startDate && (
              <p className={styles.error}>Start Date is required</p>
            )}
          </label>

          <label className={styles.label}>
            End Date:
            <Controller
              control={control}
              name="endDate"
              render={({ field }) => (
                <input className={styles.input} type="datetime-local" {...field} />
              )}
            />
            {errors.endDate && (
              <p className={styles.error}>End Date is required</p>
            )}
          </label>

          <label className={styles.label}>
            Reservierte Vor-Ort Plätze:
            <Controller
              control={control}
              name="reservedOnSiteSeats"
              render={({ field }) => (
                <input className={styles.input} type="number" {...field} />
              )}
            />
            {errors.reservedOnSiteSeats && (
              <p className={styles.error}>Please enter a valid number</p>
            )}
          </label>

          <label className={`${styles.label} ${styles.timeSlots}`}>
            Time Slots:
            {fields.map((field, index) => (
              <fieldset className={styles.timeSlotCard} key={field.id}>
                <label className={styles.label}>
                  Time Slot {index + 1}
                  <div className={styles.timeSlot}>
                    <label className={styles.label}>
                      Start:
                      <Controller
                        control={control}
                        name={`timeSlots[${index}].start`}
                        render={({ field }) => (
                          <input
                            className={styles.input}
                            type="datetime-local"
                            placeholder="Start time"
                            {...field}
                          />
                        )}
                      />
                    </label>
                    <label className={styles.label}>
                      Ende:
                      <Controller
                        control={control}
                        name={`timeSlots[${index}].end`}
                        render={({ field }) => (
                          <input
                            className={styles.input}
                            type="datetime-local"
                            placeholder="End time"
                            {...field}
                          />
                        )}
                      />
                    </label>
                    <div className={styles.links}>
                      <button
                        className={`${styles.button} ${styles.save}`}
                        type="button"
                        onClick={() => append({ start: "", end: "" })}
                      >
                        <FontAwesomeIcon icon={faPlus} size="lg" />
                      </button>
                      <button
                        className={`${styles.button} ${styles.cancel}`}
                        type="button"
                        onClick={() => remove(index)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} size="lg" />
                      </button>
                    </div>
                  </div>
                </label>
              </fieldset>
            ))}
          </label>
          <ButtonGroup
            handleCancel={handleCancel}
            saveButtonText="Event aktualisieren"
            cancelButtonText="Abbrechen"
          />
        </form>
      </div>
    </Card>
  );
}

export async function getServerSideProps(context) {
  const eventId = context.params.id;
  const session = await getSession({ req: context.req });

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (
    session?.user?.id === event.organizerId ||
    session?.user?.role == "admin"
  ) {
    return {
      props: { eventId },
    };
  } else {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }
}

export default UpdateEventPage;
