import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useApiRequest } from "@/hooks/useApiRequest";
import { useRouter } from "next/router";
import { da } from "date-fns/locale";
import { env } from "@/helpers/env";

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
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // This effect runs whenever 'event' changes. It resets form values.
  React.useEffect(() => {
    if (event) {
      reset(event); // Reset form with the fetched data
    }
  }, [event, reset]);

  const onSubmit = async (data) => {
    data = {
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      organizerId: data.organizerId,
      timeSlots: data.timeSlots ? data.timeSlots : null,
    };

    try {
      await updateEvent(data);
    } catch (err) {
      console.error(err);
    }
  };

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="name"
        render={({ field }) => <input {...field} />}
      />
      {errors.name && <p>Name is required</p>}

      <Controller
        control={control}
        name="description"
        render={({ field }) => <input {...field} />}
      />
      {errors.description && <p>Description is required</p>}

      {/* And so on for other fields... */}
      <button type="submit">Update</button>
    </form>
  );
}

export async function getServerSideProps(context) {
  const eventId = context.params.id;

  return {
    props: { eventId },
  };
}

export default UpdateEventPage;
