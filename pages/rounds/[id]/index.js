import { useRouter } from "next/router";

function DeteilRoundPage() {
  const router = useRouter();

  console.log(router.pathname);
  console.log(router.query.id);

  return (
    <>
      <h1>This is a deteiled Round Page! for {router.query.id}</h1>
    </>
  );
}

export default DeteilRoundPage;
