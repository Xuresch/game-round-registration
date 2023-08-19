import { SessionProvider } from "next-auth/react";

import Menu from "@/components/menu/menu";

import "@/styles/globals.css";

function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <SessionProvider session={session}>
        <Menu />
        <div className="conntent">
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </>
  );
}

export default App;
