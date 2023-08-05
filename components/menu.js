import Link from "next/link";
import styles from "@/styles/Menu.module.css";

const Menu = () => {
  const sites = [
    { id: "1", path: "/", lable: "Startseite" },
    { id: "2", path: "/events", lable: "Veranstaltungen" },
    { id: "3", path: "/rounds", lable: "Spielrunden" },
  ];

  const users = [
    { id: "1", path: "/join", lable: "Registrieren" },
    { id: "2", path: "/", lable: "Login" },
  ];

  return (
    <nav className={styles.menu}>
      <ul className={styles.menu_unorderd_list}>
        {sites.map((site) => (
          <li className={styles.menu_list_element} key={site.id}>
            <Link href={site.path}>{site.lable}</Link>
          </li>
        ))}
        {users.map((user) => (
          <li
            className={`${styles.menu_list_element} ${styles.log_in}`}
            key={user.id}
          >
            <Link href={user.path}>{user.lable}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
