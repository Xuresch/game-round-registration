import { useRouter } from "next/router";

function DeteilRoundPage() {
    const router = useRouter();

    console.log(router.pathname);
    console.log(router.query.roundid);

    return (
      <>
        <h1>This is a deteiled Round Page! for {router.query.roundid}</h1>
      </>
    )
  }
  
export default DeteilRoundPage;
