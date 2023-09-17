import Link from "next/link";
import styles from "./Menu.module.css";
import { signOut } from "next-auth/react";
import useSessionApp from "@/hooks/useSessionApp";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const Menu = () => {
  const { isLoading, loadedSession, user } = useSessionApp();
  const [visibleMenue, setVisibleMenue] = useState(false);
  const router = useRouter();

  console.log(router.asPath);

  function logoutHandler() {
    signOut();
  }

  function toggleMenue() {
    setVisibleMenue(!visibleMenue);
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
          <li
            className={`${styles.menu_list_element} ${
              router.pathname === site.path ? styles.activeLink : ""
            }`}
            key={site.id}
          >
            <Link href={site.path}>{site.lable}</Link>
          </li>
        ))}
        {loadedSession && (
          <li className={`${styles.menu_list_element} ${styles.log_in}`}>
            <Link href={`#`} onClick={logoutHandler}>
              Logout{" "}
            </Link>
          </li>
        )}
        {loadedSession && (
          <li
            className={`${styles.menu_list_element} ${styles.log_in} ${
              router.asPath === `/users/${user.id}/update`
                ? styles.activeLink
                : ""
            }`}
          >
            <Link href={`/users/${user.id}/update`}>Profil</Link>
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
      <section className={styles.menu_hamburger}>
        <div className={styles.menu_hamburger_icon} onClick={toggleMenue}>
          <FontAwesomeIcon icon={faBars} />
        </div>
        {visibleMenue && (
          <div className={styles.menu_hamburger_backdrop} onClick={toggleMenue}>
            <div className={styles.menu_hamburger_overlay}>
              <ul className={styles.menu_hamburger_list}>
                {loadedSession && (
                  <li className={`${styles.menu_hamburger_list_element}`}>
                    <Link href={`/users/${user.id}/update`}>Profil</Link>
                  </li>
                )}
                {sites.map((site) => (
                  <li
                    className={`${styles.menu_hamburger_list_element} ${
                      router.pathname === site.path
                        ? styles.menu_hamburger_activeLink
                        : ""
                    }`}
                    key={site.id}
                  >
                    <Link href={site.path}>{site.lable}</Link>
                  </li>
                ))}

                {loadedSession && (
                  <li className={`${styles.menu_hamburger_list_element}`}>
                    <Link href={`#`} onClick={logoutHandler}>
                      Logout{" "}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
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
      </section>
    </nav>
  );
};

export default Menu;
