import prisma from "@/lib/prisma";
import Joi from "joi";
import bcrypt from "bcryptjs";

import { validate } from "@/helpers/validate";

const schema = Joi.object({
  username: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string()
    .valid("temporary", "normal", "organizer", "admin")
    .required(),
});

export default async function usersHandler(req, res) {
  if (req.method === "GET") {
    const users = await prisma.user.findMany();
    res.json(users);
  } else if (req.method === "POST") {
    if (req.body.username === "") {
      req.body.username = req.body.email;
    }

    try {
      validate(schema, req.body);
    } catch (error) {
      res.status(400).json({ error_code: "ValidationError", message: error.message });
      return;
    }

    const existingUserEmail = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (existingUserEmail) {
      res.status(400).json({error_code: "ExistingUser", message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = await prisma.user.create({
      data: {
        ...req.body,
        password: hashedPassword,
      },
    });

    res.json(newUser);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
