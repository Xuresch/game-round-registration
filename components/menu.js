import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./Menu.module.css";
import { getSession, signOut } from "next-auth/react";

const Menu = () => {
  const [isSignUp, setIsSignUp] = useState(false); // Local state to toggle between Sign In and Sign Up
  const [isLoading, setIsLoading] = useState(true); // Local state to toggle loading state
  const [loadedSession, setLoadedSession] = useState(null); // Local state to store session data

  useEffect(() => {
    getSession().then((session) => {
      setLoadedSession(session);
      setIsLoading(false);
    });
  }, []);

  function logoutHandler() {
    signOut();
  }

  const sites = [
    { id: "1", path: "/", lable: "Startseite" },
    { id: "2", path: "/events", lable: "Veranstaltungen" },
    { id: "3", path: "/rounds", lable: "Spielrunden" },
  ];

  return (
    <nav className={styles.menu}>
      <ul className={styles.menu_unorderd_list}>
        {sites.map((site) => (
          <li className={styles.menu_list_element} key={site.id}>
            <Link href={site.path}>{site.lable}</Link>
          </li>
        ))}
        {loadedSession && (
          <button
            className={`${styles.button} ${styles.log_in}`}
            onClick={logoutHandler}
          >
            Logout
          </button>
        )}
        {loadedSession && (
          <li className={`${styles.menu_list_element} ${styles.log_in}`}>
            <Link href={`/profile/${"Test"}`}>Profile</Link>
          </li>
        )}
        {!loadedSession && (
          <li className={`${styles.menu_list_element} ${styles.log_in}`}>
            <Link href="/auth">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Menu;
