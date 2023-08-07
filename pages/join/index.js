import React from "react";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import Link from "next/link";

import styles from "@/styles/Join.module.css";
import Card from "@/components/shared/card";
import { env } from "@/helpers/env";
import { useApiRequest } from "@/hooks/useApiRequest";

// Define validation schema with Yup
const schema = Yup.object().shape({
  username: Yup.string(),
  email: Yup.string().required(),
  password: Yup.string().required(),
  role: Yup.string().required(),
});

function JoinPage() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      role: "normal",
    },
  });

  const {
    fetchData: createUser,
    data: createUserData,
    loading: createUserLoading,
    error: createUserError,
  } = useApiRequest(`${env.BASE_API_URL}/users`, "POST", null, false);

  const onSubmit = async (data) => {
    console.log("submit", data);
    try {
      await createUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    if (!createUserLoading && !createUserError && createUserData) {
      router.push(`${env.BASE_URL}/events`);
    }
  }, [createUserLoading, createUserError, createUserData]);

  return (
    <Card>
      <div className={styles.header}>
        <h2 className={styles.title}>Registrierung</h2>
        <p className={styles.subtitle}>
          Registrier dich jetzt um deine Spielrunden zu organisieren und anzubieten.
        </p>
        <p className={styles.subtitle}>
          Hast du schon einen account? Dann geht es hier zum {" "}
          <Link className={styles.loginLink} href="/login">Login</Link> {" !"} 
        </p>
      </div>
      <div className={styles.content}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className={styles.label}>
            Email:
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <input className={styles.input} {...field} />
              )}
            />
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </label>
          <label className={styles.label}>
            Username:
            <Controller
              control={control}
              name="username"
              render={({ field }) => (
                <input className={styles.input} {...field} />
              )}
            />
            {errors.username && (
              <p className={styles.error}>This field is required</p>
            )}
          </label>
          <label className={styles.label}>
            Password:
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <input className={styles.input} {...field} type="password" />
              )}
            />
            {errors.password && (
              <p className={styles.error}>This field is required</p>
            )}
          </label>
          <div className={styles.buttonWrapper}>
            <button className={styles.button} type="submit">
              Registrieren
            </button>
          </div>
        </form>
      </div>
    </Card>
  );
}

export default JoinPage;
