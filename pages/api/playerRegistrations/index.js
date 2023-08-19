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
    const playerId = req.query.playerId;
    const gameRoundId = req.query.gameRoundId;
    const status = req.query.status;

    let playerRegistrations;

    if (playerId && gameRoundId) {
      playerRegistrations = await prisma.playerRegistration.findMany({
        where: {
          playerId: playerId,
          gameRoundId: gameRoundId,
        },
      });
    } else if (status && gameRoundId) {
      playerRegistrations = await prisma.playerRegistration.findMany({
        where: {
          status: status,
          gameRoundId: gameRoundId,
        },
        include: {
          Player: {
            select: {
              userName: true,
            },
          },
        },
      });
    } else {
      playerRegistrations = await prisma.playerRegistration.findMany();
    }

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
