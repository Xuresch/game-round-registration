// import styles from "./Home.module.css";

import { useRouter } from "next/router";

function RoundPage() {

  const router = useRouter();

  console.log(router.pathname);
  console.log(router.query.id);

  return (
    <div>
      <p>Round Page</p>
    </div>
  );
}

export default RoundPage;
