import useSWR, { mutate } from "swr";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "@/styles/Menu.module.css";

import { env } from "@/helpers/env";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Menu = () => {
  const router = useRouter();
  const { data, error } = useSWR(`${env.BASE_API_URL}/auth/user`, fetcher);
  const user = data?.user;
  const isLoading = !error && !data;

  console.log(user);

  const sites = [
    { id: "1", path: "/", lable: "Startseite" },
    { id: "2", path: "/events", lable: "Veranstaltungen" },
    { id: "3", path: "/rounds", lable: "Spielrunden" },
  ];

  const users = user
    ? [
        { id: "1", path: "/profile", lable: "Profile" },
        { id: "2", path: "#", lable: "Logout" },
      ]
    : [
        { id: "1", path: "/join", lable: "Registrieren" },
        { id: "2", path: "/auth?type=normal", lable: "Login" },
      ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const logout = async () => {
    const response = await axios.get(`${env.BASE_API_URL}/auth/logout`);
    if (response.status === 200) {
      mutate(`${env.BASE_API_URL}/auth/user`);
      router.push("/");
    }
  };

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
            {user.lable === "Logout" ? (
              <a href="#" onClick={logout}>
                {user.lable}
              </a>
            ) : (
              <Link href={user.path}>{user.lable}</Link>
            )}
          </li>
        ))}
        {user && (
          <li className={`${styles.menu_list_element} ${styles.user}`}><p>Hallo {user.username}</p></li>
        )}
      </ul>
    </nav>
  );
};

export default Menu;
