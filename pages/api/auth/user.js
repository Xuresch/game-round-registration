import { withIronSessionApiRoute } from "iron-session/next";

import { env } from "@/helpers/env";

export default withIronSessionApiRoute(
  function userRoute(req, res) {
    const user = req.session.user;
    if (!user) {
      return res.status(200).json({ user: null });
    }

    return res.status(200).json({ user });
  },
  {
    cookieName: env.COOKIE_NAME,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
    password: process.env.APPLICATION_SECRET,
  }
);
