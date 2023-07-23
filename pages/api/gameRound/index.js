import prisma from "@/lib/prisma";
import Joi from "joi";

const schema = Joi.object({
    eventId: Joi.string().allow(null),
    gameMasterId: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    gameType: Joi.string().required(),
    gameSystem: Joi.string().allow(null),
    genre: Joi.string().required(),
    recommendedAge: Joi.number().integer().required(),
    startTime: Joi.string().isoDate().required(),
    endTime: Joi.string().isoDate().required(),
    playerLimit: Joi.number().integer().required(),
    waitingList: Joi.boolean().required(),
    extraDetails: Joi.object().allow(null)
  });

export default async function gameRoundsHandler(req, res) {
  if (req.method === "GET") {
    const gameRounds = await prisma.gameRound.findMany();
    res.json(gameRounds);
  } else if (req.method === "POST") {
    const result = schema.validate(req.body);
    if (result.error) {
      res.status(400).json({ message: result.error.details[0].message });
      return;
    }

    const newGameRound = await prisma.gameRound.create({
      data: {
        ...req.body,
      },
    });

    res.json(newGameRound);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
