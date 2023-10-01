import styles from "./SmallCard.module.css";

function SmallCard({ children }) {
  return <div className={styles.card}>{children}</div>;
}

export default SmallCard;
