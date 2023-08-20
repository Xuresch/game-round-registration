import prisma from "@/lib/prisma";
import Joi from "joi";
import { validate } from "@/helpers/validate";

const schema = Joi.object({
  eventId: Joi.string(),
  gameMasterId: Joi.string(),
  name: Joi.string(),
  description: Joi.string(),
  gameType: Joi.string(),
  gameSystem: Joi.string(),
  genre: Joi.string(),
  recommendedAge: Joi.number().integer(),
  startTime: Joi.string().isoDate(),
  endTime: Joi.string().isoDate(),
  playerLimit: Joi.number().integer(),
  waitingList: Joi.boolean(),
  extraDetails: Joi.object().pattern(
    Joi.string(),
    Joi.alternatives().try(
      Joi.string(),
      Joi.number(),
      Joi.boolean(),
      Joi.object()
    )
  ),
});

export default async function gameRoundHandler(req, res) {
  const gameRoundId = req.query.id;

  if (req.method === "GET") {
    const gameRound = await prisma.gameRound.findUnique({
      where: { id: gameRoundId },
    });

    if (!gameRound) {
        res.status(404).json({ message: "Game round not found" });
        return;
    }

    const registeredPlayersCount = await prisma.playerRegistration.count({
      where: { gameRoundId: gameRoundId, status: "registered" }
    });

    gameRound.extraDetails = JSON.parse(gameRound.extraDetails);
    gameRound.registeredPlayersCount = registeredPlayersCount;

    res.json(gameRound);
  } else if (req.method === "PUT") {
    try {
      validate(schema, req.body);
    } catch (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    const updatedGameRound = await prisma.gameRound.update({
      where: { id: gameRoundId },
      data: {
        ...req.body,
        extraDetails: JSON.stringify(req.body.extraDetails),
      },
    });

    res.json(updatedGameRound);
  } else if (req.method === "DELETE") {
    const deletedGameRound = await prisma.gameRound.delete({
      where: { id: gameRoundId },
    });
    res.json(deletedGameRound);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
