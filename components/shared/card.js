import styles from "@/styles/Card.module.css";

function Card({ children }) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>{children}</div>
    </div>
  );
}

export default Card;
