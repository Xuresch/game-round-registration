import { withIronSessionApiRoute } from "iron-session/next";

import { env } from "@/helpers/env";

export default withIronSessionApiRoute(
  function logoutRoute(req, res, session) {
    if (req.method === "GET") {
      req.session.destroy();
      res.send({ ok: true });
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  },
  {
    cookieName: env.COOKIE_NAME,
    cookieOptions: {
      secure: env.NODE_ENV === "production" ? true : false,
    },
    password: env.APPLICATION_SECRET,
  }
);
