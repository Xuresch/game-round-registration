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
  genres: Joi.string(),
  recommendedAge: Joi.number().integer(),
  startTime: Joi.string().isoDate(),
  endTime: Joi.string().isoDate(),
  playerLimit: Joi.number().integer(),
  waitingList: Joi.boolean(),
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

    // Fetch associated genres for the game round
    const associatedGenres = await prisma.gameRoundGenre.findMany({
      where: { gameRoundId: gameRoundId },
      include: {
        genre: true,
      },
    });

    // Extract genre details
    const genres = associatedGenres.map((association) => association.genre);

    const registeredPlayersCount = await prisma.playerRegistration.count({
      where: { gameRoundId: gameRoundId, status: "registered" },
    });

    gameRound.extraDetails = JSON.parse(gameRound.extraDetails);
    gameRound.registeredPlayersCount = registeredPlayersCount;

    res.json({ ...gameRound, genres });
  } else if (req.method === "PUT") {
    try {
      validate(schema, req.body);
    } catch (error) {
      res.status(400).json({ message: error.message });
      return;
    }
    const genreCodes = req.body.genres.split(",");

    const updatedGameRound = await prisma.gameRound.update({
      where: { id: gameRoundId },
      data: {
        ...req.body,
        genres: undefined, // Exclude genres from update
        extraDetails: JSON.stringify(req.body.extraDetails),
      },
    });

    // Delete existing genre associations for the game round
    await prisma.gameRoundGenre.deleteMany({
      where: { gameRoundId: gameRoundId },
    });

    // Add new genre associations for the game round
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
