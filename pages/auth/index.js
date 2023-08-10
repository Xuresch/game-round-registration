import React, { useState } from "react";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";

import { signIn } from "next-auth/react";

import styles from "./Auth.module.css";
import Card from "@/components/shared/card";
import { env } from "@/helpers/env";

// Define validation schema with Yup
const schema = Yup.object().shape({
  email: Yup.string().required(),
});

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false); // Local state to toggle between Sign In and Sign Up

  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      userName: "",
    },
  });

  const onSubmit = async (data) => {
    const { email: originalEmail, userName } = data;
    const email = originalEmail.toLowerCase();
    const responseTmp = await fetch(
      `${env.BASE_API_URL}/auth/storeTempUserData`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, userName }),
      }
    );
    console.log(responseTmp);
    const response = await signIn("email", { redirect: false, email });
    console.log(response);
  };

  return (
    <Card>
      <div className={styles.header}>
        <h2 className={styles.title}>{isSignUp ? "Sign Up" : "Login"}</h2>
        <p className={styles.subtitle}>
          Log dich jetzt ein um deine Spielrunden zu organisieren und
          anzubieten.
        </p>
        <p className={styles.subtitle}>
          {isSignUp ? "Hast du einen Account?" : "Hast du noch keinen Account?"}
          <button
            className={styles.registrationLink}
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Einloggen" : "Registrierung"}
          </button>
        </p>
      </div>
      <div className={styles.content}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
          {isSignUp && ( // Only render the username field when signing up
            <label className={styles.label}>
              Username:
              <Controller
                control={control}
                name="userName"
                render={({ field }) => (
                  <input className={styles.input} {...field} />
                )}
              />
              {errors.userName && (
                <p className={styles.error}>{errors.userName.message}</p>
              )}
            </label>
          )}
          <div className={styles.buttonWrapper}>
            <button className={styles.button} type="submit">
              {isSignUp ? "Registrierung" : "Einloggen"}
            </button>
          </div>
        </form>
      </div>
    </Card>
  );
}

export default AuthPage;
