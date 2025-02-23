// pages/api/gameRounds/[id].js
import prisma from "@/lib/prisma";
import Joi from "joi";
import { validate } from "@/helpers/validate";

const schema = Joi.object({
  eventId: Joi.string().allow(null),
  gameMasterId: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().allow(null, ""),
  gameType: Joi.string().required(),
  gameSystem: Joi.string().allow(null),
  genres: Joi.string().required().allow(null),
  recommendedAge: Joi.number().integer(),
  startTime: Joi.string().isoDate().required(),
  endTime: Joi.string().isoDate().required(),
  playerLimit: Joi.number().integer().required(),
  waitingList: Joi.boolean().required(),
  extraDetails: Joi.string().allow(null),
  isOnSiteOnlyRegistration: Joi.boolean() // NEUES FELD
});

export default async function gameRoundHandler(req, res) {
  const gameRoundId = req.query.id;

  if (req.method === "GET") {
    const gameRound = await prisma.gameRound.findUnique({
      where: { id: gameRoundId },
      include: {
        GameRoundGenre: {
          include: {
            genre: true,
          },
        },
        PlayerRegistrations: {
          where: { status: "registered" },
          select: { id: true },
        },
        Event: {
          select: { reservedOnSiteSeats: true }
        }
      },
    });

    if (!gameRound) {
      res.status(404).json({ message: "Game round not found" });
      return;
    }

    gameRound.extraDetails = gameRound.extraDetails ? JSON.parse(gameRound.extraDetails) : null;
    gameRound.registeredPlayersCount = gameRound.PlayerRegistrations.length;
    const reservedOnSiteSeats = gameRound.Event ? gameRound.Event.reservedOnSiteSeats : 0;
    delete gameRound.Event;

    res.json({ ...gameRound, reservedOnSiteSeats });
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
        genres: undefined,
        extraDetails: req.body.extraDetails ? JSON.stringify(req.body.extraDetails) : null,
      },
    });

    await prisma.gameRoundGenre.deleteMany({
      where: { gameRoundId: gameRoundId },
    });

    if (req.body.genres !== null) {
      const genreCodes = req.body.genres.split(",");
      for (const genreCode of genreCodes) {
        const genre = await prisma.genre.findUnique({
          where: { code: genreCode },
        });
        if (genre) {
          await prisma.gameRoundGenre.create({
            data: {
              gameRoundId: gameRoundId,
              genreId: genre.id,
            },
          });
        }
      }
    }

    res.json(updatedGameRound);
  } else if (req.method === "DELETE") {
    await prisma.gameRoundGenre.deleteMany({
      where: { gameRoundId: gameRoundId },
    });
    await prisma.playerRegistration.deleteMany({
      where: { gameRoundId: gameRoundId },
    });
    const deletedGameRound = await prisma.gameRound.delete({
      where: { id: gameRoundId },
    });
    res.json(deletedGameRound);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
