import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { withIronSessionApiRoute } from "iron-session/next";

import { env } from "@/helpers/env";

export default withIronSessionApiRoute(
  async function loginRoute(req, res) {
    if (req.method === "POST") {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      await req.session.save();
      res.send({ done: true });
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
