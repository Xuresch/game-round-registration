import Link from 'next/link';
import styles from '@/styles/Menu.module.css';

const Menu = () => {

    const sites = [
        { id: "1", path: "/", lable: "Startseite"},
        { id: "2", path: "/rounds", lable: "Spielrunden" },
    ];


  return (
    <nav className={styles.menu}>
      <ul className={styles.menu_unorderd_list}>
        {sites.map((site) => (
            <li className={styles.menu_list_element} key={site.id}>
                <Link href={ site.path }>{ site.lable }</Link>
            </li>
        ))}
        <li className={`${styles.menu_list_element} ${styles.log_in}`}>
            <Link href="/">Log In</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
