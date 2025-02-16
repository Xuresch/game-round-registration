import prisma from "@/lib/prisma";
import Joi from "joi";
import { validate } from "@/helpers/validate";

const schema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  startDate: Joi.string().isoDate(),
  endDate: Joi.string().isoDate(),
  organizerId: Joi.string(),
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
  reservedOnSiteSeats: Joi.number().integer().min(0),
});

const getEvent = async (req, res) => {
  const eventId = req.query.id;
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    return res.status(404).json({ message: `Event with id ${eventId} not found!` });
  }

  // Versuchen, timeSlots als JSON zu parsen (falls vorhanden)
  if (event.timeSlots) {
    try {
      event.timeSlots = JSON.parse(event.timeSlots);
    } catch (e) {
      event.timeSlots = null;
    }
  }
  return res.json(event);
};

const updateEvent = async (req, res) => {
  const eventId = req.query.id;
  try {
    validate(schema, req.body);
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        ...req.body,
        timeSlots: req.body.timeSlots ? JSON.stringify(req.body.timeSlots) : null,
      },
    });
    return res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  const eventId = req.query.id;
  const deletedEvent = await prisma.event.delete({
    where: { id: eventId },
  });
  return res.json(deletedEvent);
};

const methodNotAllowed = (req, res) => {
  return res.status(405).json({ message: "Method Not Allowed!" });
};

const handlers = {
  GET: getEvent,
  PUT: updateEvent,
  DELETE: deleteEvent,
};

export default async function eventHandler(req, res) {
  const handler = handlers[req.method] || methodNotAllowed;
  try {
    await handler(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
}
