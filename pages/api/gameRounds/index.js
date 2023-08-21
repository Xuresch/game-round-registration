import prisma from "@/lib/prisma";
import Joi from "joi";

import { validate } from "@/helpers/validate";

const schema = Joi.object({
  eventId: Joi.string().allow(null),
  gameMasterId: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  gameType: Joi.string().required(),
  gameSystem: Joi.string().allow(null),
  genre: Joi.string().required(),
  recommendedAge: Joi.number().integer(),
  startTime: Joi.string().isoDate().required(),
  endTime: Joi.string().isoDate().required(),
  playerLimit: Joi.number().integer().required(),
  waitingList: Joi.boolean().required(),
  extraDetails: Joi.string().allow(null),
  // extraDetails: Joi.object().pattern(
  //   Joi.string(),
  //   Joi.alternatives().try(
  //     Joi.string(),
  //     Joi.number(),
  //     Joi.boolean(),
  //     Joi.object()
  //   )
  // ),
});

export default async function gameRoundsHandler(req, res) {
  if (req.method === "GET") {
    const eventId = req.query.eventId;

    let gameRounds;
    if (eventId) {
      gameRounds = await prisma.gameRound.findMany({
        where: { eventId: eventId },
        include: {
          PlayerRegistrations: {
            where: { status: "registered" },
            select: { id: true },
          },
        },
      });
    } else {
      gameRounds = await prisma.gameRound.findMany({
        include: {
          PlayerRegistrations: {
            where: { status: "registered" },
            select: { id: true },
          },
        },
      });
    }
    // Parse the extraDetails for each gameRound
    const parsedGameRounds = gameRounds.map((gameRound) => ({
      ...gameRound,
      registeredPlayersCount: gameRound.PlayerRegistrations.length,
      extraDetails: JSON.parse(gameRound.extraDetails),
    }));

    res.json(parsedGameRounds);
  } else if (req.method === "POST") {
    try {
      validate(schema, req.body);
    } catch (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    const newGameRound = await prisma.gameRound.create({
      data: {
        ...req.body,
        extraDetails: JSON.stringify(req.body.extraDetails),
      },
    });

    res.json(newGameRound);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
