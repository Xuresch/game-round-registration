import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useApiRequest } from "@/hooks/useApiRequest";
import { useRouter } from "next/router";
import { env } from "@/helpers/env";
import Card from "@/components/shared/card/card";
import styles from "./EventAdd.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getSession } from "next-auth/react";
import apiService from "@/lib/shared/apiService";

// Define validation schema with Yup
const schema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
  startDate: Yup.date().required(),
  endDate: Yup.date().required(),
  location: Yup.string().required(),
  // Add validation rules for other fields...
});

function CreateEventPage({ session }) {
  const isClient = typeof window !== "undefined";
  const router = useRouter();

  const {
    fetchData: createEvent,
    data: createdEventData,
    loading: createEventLoading,
    error: createEventError,
  } = useApiRequest(`${env.BASE_API_URL}/events`, "POST", null, false);

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
      location: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "timeSlots",
  });

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

  function arrayToJson(timeSlots) {
    return timeSlots.reduce((json, slot, index) => {
      json[`slot_${index + 1}`] = slot;
      return json;
    }, {});
  }

  async function sendRegistrationEmail(eventData) {
    try {
      const emailData = {
        templateName: "eventCreation",
        templateData: {
          name: user.userName,
          // date: eventData.startDate,
          eventName: eventData.name,
          eventUrl: `${env.BASE_URL}/events/${eventData.id}`,
        },
        emailDetails: {
          to: user.email,
          subject: `Neu erstelltes Event ${eventData.name}!`,
        },
      };
      const response = await apiService.sendEmail(emailData);
      console.log("Email sent successfully:", response);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  const onSubmit = async (data) => {
    data = {
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      organizerId: user.id,
      timeSlots: arrayToJson(data.timeSlots),
      location: data.location,
    };
    // console.log(data);

    try {
      await createEvent(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (event) => {
    event.preventDefault();
    router.push(`${env.BASE_URL}/events`);
  };

  // handle response from the PUT request
  useEffect(() => {
    if (!createEventError && !createEventLoading && createdEventData) {
      sendRegistrationEmail(createdEventData);
      router.push(`${env.BASE_URL}/events/${createdEventData.id}`);
    }
  }, [createEventError, createEventLoading, createdEventData]);

  return (
    <Card>
      <div className={styles.header}>
        <h2 className={styles.title}>Erstelle Event</h2>
      </div>
      <div className={styles.content}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
            Veranstaltingsort:
            <Controller
              control={control}
              name="location"
              render={({ field }) => (
                <input className={styles.input} {...field} />
              )}
            />
            {errors.location && (
              <p className={styles.error}>location is required</p>
            )}
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
  const session = await getSession({ req: context.req });

  if (session?.user?.role == "organizer" || session?.user?.role == "admin") {
    return {
      props: { session },
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

export default CreateEventPage;
