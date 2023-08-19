import Link from "next/link";
import styles from "./Menu.module.css";
import { signOut } from "next-auth/react";
import useSessionApp from "@/hooks/useSessionApp";

const Menu = () => {
  const {isLoading, loadedSession, user} = useSessionApp();

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
        {loadedSession && (
          <li className={`${styles.user_name} ${styles.log_in}`}>
            <p>{loadedSession?.user?.userName}</p>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Menu;
