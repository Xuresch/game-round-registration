import React from "react";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { mutate } from 'swr';

import styles from "@/styles/Auth.module.css";
import Card from "@/components/shared/card";
import { env } from "@/helpers/env";

// Define validation schema with Yup
const schema = Yup.object().shape({
  email: Yup.string().required(),
  password: Yup.string().required(),
});

function AuthPage() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${env.BASE_API_URL}/auth/login`, data);
      if (response.data.done) {
        mutate(`${env.BASE_API_URL}/auth/user`);
        router.push(`${env.BASE_URL}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card>
      <div className={styles.header}>
        <h2 className={styles.title}>Login</h2>
        <p className={styles.subtitle}>
          Log dich jetzt ein um deine Spielrunden zu organisieren und
          anzubieten.
        </p>
        <p className={styles.subtitle}>
          Hast du noch keinen Account? Dann geht es hier zur{" "}
          <Link className={styles.registrationLink} href="/join">
            Registrierung
          </Link>{" "}
          {" !"}
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
              Login
            </button>
          </div>
        </form>
      </div>
    </Card>
  );
}

export default AuthPage;
