import prisma from "@/lib/prisma";
import Joi from "joi";

const schema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  startDate: Joi.string().isoDate(),
  endDate: Joi.string().isoDate(),
  organizerId: Joi.number(),
  timeSlots: Joi.object().pattern(
    Joi.string(),
    Joi.alternatives().try(
      Joi.string(),
      Joi.number(),
      Joi.boolean(),
      Joi.object()
    )
  ),
});

export default async function eventHandler(req, res) {
  const eventId = req.query.id;

  if (req.method === "GET") {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    event.timeSlots = JSON.parse(event.timeSlots);
    if (!event) res.status(404).json({ message: "event not found" });
    else res.json(event);
  } else if (req.method === "PUT") {
    const result = schema.validate(req.body);
    if (result.error) {
      res.status(400).json({ message: result.error.details[0].message });
      return;
    }

    const updatedevent = await prisma.event.update({
      where: { id: eventId },
      data: {
        ...req.body,
        timeSlots: JSON.stringify(req.body.timeSlots),
      },
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
