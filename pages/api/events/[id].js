import prisma from "@/lib/prisma";
import Joi from "joi";

const schema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  startDate: Joi.string().isoDate(),
  endDate: Joi.string().isoDate(),
  organizerId: Joi.number(),
});

export default async function eventHandler(req, res) {
  const eventId = req.query.id;

  if (req.method === "GET") {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) res.status(404).json({ message: "event not found" });
    else res.json(event);
  } else if (req.method === "PUT") {
    const result = schema.validate(req.body);
    if (result.error) {
      res.status(400).json({ message: result.error.details[0].message });
      return;
    }

    let data = { ...req.body };

    const updatedevent = await prisma.event.update({
      where: { id: eventId },
      data,
    });

    res.json(updatedevent);
  } else if (req.method === "DELETE") {
    const deletedevent = await prisma.event.delete({
      where: { id: eventId },
    });
    res.json(deletedevent);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
