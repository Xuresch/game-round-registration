import prisma from "@/lib/prisma";
import Joi from "joi";
import { validate } from "@/helpers/validate";

const schema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  startDate: Joi.string().isoDate().required(),
  endDate: Joi.string().isoDate().required(),
  organizerId: Joi.string().required(),
  timeSlots: Joi.object()
    .pattern(
      Joi.string(),
      Joi.alternatives().try(
        Joi.string(),
        Joi.number(),
        Joi.boolean(),
        Joi.object()
      )
    )
    .allow(null),
  reservedOnSiteSeats: Joi.number().integer().min(0)
});

export default async function eventsHandler(req, res) {
  if (req.method === "GET") {
    const events = await prisma.event.findMany({
      orderBy: {
        startDate: "asc",
      },
    });
    const parsedEvents = events.map((event) => ({
      ...event,
      timeSlots: event.timeSlots ? JSON.parse(event.timeSlots) : null,
    }));
    res.json(parsedEvents);
  } else if (req.method === "POST") {
    try {
      validate(schema, req.body);
    } catch (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    const newEvent = await prisma.event.create({
      data: {
        ...req.body,
        timeSlots: req.body.timeSlots ? JSON.stringify(req.body.timeSlots) : null,
      },
    });

    res.json(newEvent);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
