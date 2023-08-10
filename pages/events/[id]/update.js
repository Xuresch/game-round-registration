import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useApiRequest } from "@/hooks/useApiRequest";
import { useRouter } from "next/router";
import { env } from "@/helpers/env";
import Card from "@/components/shared/card";
import styles from "./UpdateEvent.module.css";
import { formatISO } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPlus } from "@fortawesome/free-solid-svg-icons";

// Define validation schema with Yup
const schema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
  startDate: Yup.date().required(),
  endDate: Yup.date().required(),
  // Add validation rules for other fields...
});

function UpdateEventPage({ eventId }) {
  const router = useRouter();

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
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "timeSlots",
  });

  // Function to convert date to user's timezone and format it
  function formatToUserTimezone(dateStr, timezone) {
    const date = utcToZonedTime(dateStr, timezone);
    return (
      formatISO(date, { representation: "date" }) +
      "T" +
      formatISO(date, { representation: "time" }).slice(0, 5)
    );
  }

  // This effect runs whenever 'event' changes. It resets form values.
  React.useEffect(() => {
    if (event) {
      const formattedEvent = { ...event };

      // Get user's timezone
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Convert the dates to the user's timezone and format them
      formattedEvent.startDate = formatToUserTimezone(
        event.startDate,
        userTimezone
      );
      formattedEvent.endDate = formatToUserTimezone(
        event.endDate,
        userTimezone
      );

      formattedEvent.timeSlots = jsonToArray(event.timeSlots);

      reset(formattedEvent); // Reset form with the fetched data
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
    data = {
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      organizerId: data.organizerId,
      timeSlots: arrayToJson(data.timeSlots),
    };

    try {
      await updateEvent(data);
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

  React.useEffect(() => {
    if (!deleteEventLoading && !deleteEventError && deleteEventData) {
      router.push(`${env.BASE_URL}/events`);
    }
  }, [deleteEventLoading, deleteEventError, deleteEventData]);

  // handle response from the PUT request
  React.useEffect(() => {
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

          <label className={styles.label}>
            Organizer ID:
            <Controller
              control={control}
              name="organizerId"
              render={({ field }) => (
                <input className={styles.input} {...field} />
              )}
            />
            {errors.organizerId && (
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
            {errors.name && <p className={styles.error}>Name is required</p>}
          </label>

          <label className={styles.label}>
            Description:
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <textarea className={styles.input} {...field} />
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
                <input
                  className={styles.input}
                  type="datetime-local"
                  {...field}
                />
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
                <input
                  className={styles.input}
                  type="datetime-local"
                  {...field}
                />
              )}
            />
            {errors.endDate && (
              <p className={styles.error}>End Date is required</p>
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
          <div className={styles.buttonWrapper}>
            <button className={`${styles.button} ${styles.save}`} type="submit">
              Event speichern
            </button>
            <button
              onClick={handleCancel}
              className={`${styles.button} ${styles.cancel}`}
            >
              Abbrechen
            </button>
          </div>
        </form>
      </div>
    </Card>
  );
}

export async function getServerSideProps(context) {
  const eventId = context.params.id;

  return {
    props: { eventId },
  };
}

export default UpdateEventPage;
