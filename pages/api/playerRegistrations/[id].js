import prisma from "@/lib/prisma";
import Joi from "joi";

const schema = Joi.object({
  playerId: Joi.number(),
  gameRoundId: Joi.string(),
  status: Joi.string().valid("registered", "waiting"),
  joinedAt: Joi.date().iso(),
});

export default async function playerRegistrationHandler(req, res) {
  const playerId = req.query.id;

  if (req.method === "GET") {
    const playerRegistration = await prisma.playerRegistration.findUnique({
      where: { id: Number(playerId) },
    });

    if (!playerRegistration)
      res.status(404).json({ message: "Player Registration not found" });
    else res.json(playerRegistration);
  } else if (req.method === "PUT") {
    const { error } = schema.validate(req.body);

    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const updatedPlayerRegistration = await prisma.playerRegistration.update({
      where: { id: Number(playerId) },
      data: { ...req.body },
    });

    res.json(updatedPlayerRegistration);
  } else if (req.method === "DELETE") {
    const deletedPlayerRegistration = await prisma.playerRegistration.delete({
      where: { id: Number(playerId) },
    });

    res.json(deletedPlayerRegistration);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
