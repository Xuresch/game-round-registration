// pages/api/gameRounds/index.js
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

export default async function gameRoundsHandler(req, res) {
  if (req.method === "GET") {
    const eventId = req.query.eventId;

    let gameRounds;
    if (eventId) {
      gameRounds = await prisma.gameRound.findMany({
        where: { eventId: eventId },
        include: {
          GameRoundGenre: {
            include: {
              genre: {
                select: { id: true, value: true },
              },
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
    } else {
      gameRounds = await prisma.gameRound.findMany({
        include: {
          GameRoundGenre: {
            include: {
              genre: {
                select: { id: true, value: true },
              },
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
    }
    const parsedGameRounds = gameRounds.map((gameRound) => ({
      ...gameRound,
      registeredPlayersCount: gameRound.PlayerRegistrations.length,
      extraDetails: gameRound.extraDetails ? JSON.parse(gameRound.extraDetails) : null,
      reservedOnSiteSeats: gameRound.Event ? gameRound.Event.reservedOnSiteSeats : 0,
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
        genres: undefined,
        extraDetails: req.body.extraDetails ? JSON.stringify(req.body.extraDetails) : null,
      },
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
              gameRoundId: newGameRound.id,
              genreId: genre.id,
            },
          });
        }
      }
    }

    res.json(newGameRound);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
