import prisma from "@/lib/prisma";
import Joi from "joi";

const schema = Joi.object({
    eventId: Joi.string(),
    gameMasterId: Joi.number(),
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
    extraDetails: Joi.string()
  });

export default async function gameRoundHandler(req, res) {
  const gameRoundId = req.query.id;

  if (req.method === "GET") {
    const gameRound = await prisma.gameRound.findUnique({
      where: { id: gameRoundId },
    });
    if (!gameRound) res.status(404).json({ message: "Game round not found" });
    else res.json(gameRound);
  } else if (req.method === "PUT") {
    const result = schema.validate(req.body);
    if (result.error) {
      res.status(400).json({ message: result.error.details[0].message });
      return;
    }

    const updatedGameRound = await prisma.gameRound.update({
      where: { id: gameRoundId },
      data: { ...req.body },
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
