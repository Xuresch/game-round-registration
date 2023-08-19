import prisma from "@/lib/prisma";
import Joi from "joi";
import bcrypt from "bcryptjs";

import { validate } from "@/helpers/validate";

const schema = Joi.object({
  username: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(8),
  role: Joi.string().valid("temporary", "normal", "organizer", "admin"),
});

export default async function userHandler(req, res) {
  const userId = req.query.id;

  if (req.method === "GET") {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json({
        code: "GetUser",
        message: "Get user successfully!",
        data: user,
      });
    }
  } else if (req.method === "PUT") {
    try {
      validate(schema, req.body);
    } catch (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    let data = { ...req.body };

    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      data.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    res.json(updatedUser);
  } else if (req.method === "DELETE") {
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    delete deletedUser.password;

    res.json({
      code: "UserDeleted",
      message: "User has been deleted!",
      data: deletedUser,
    });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
