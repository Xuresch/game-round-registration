import prisma from "@/lib/prisma";
import Joi from "joi";

import { validate } from "@/helpers/validate";

const schema = Joi.object({
  playerId: Joi.string().required(),
  gameRoundId: Joi.string().required(),
  status: Joi.string().valid("registered", "waiting").required(),
  joinedAt: Joi.date().iso().required(),
});

export default async function playerRegistrationsHandler(req, res) {
  if (req.method === "GET") {
    const playerRegistrations = await prisma.playerRegistration.findMany();
    res.json(playerRegistrations);
  } else if (req.method === "POST") {
    try {
      validate(schema, req.body);
    } catch (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    const newPlayerRegistration = await prisma.playerRegistration.create({
      data: { ...req.body },
    });

    res.json(newPlayerRegistration);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
