import prisma from "@/lib/prisma";
import Joi from "joi";

const schema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  startDate: Joi.string().isoDate().required(),
  endDate: Joi.string().isoDate().required(),
  organizerId: Joi.number().required(),
});

export default async function eventsHandler(req, res) {
  if (req.method === "GET") {
    const events = await prisma.event.findMany();
    res.json(events);
  } else if (req.method === "POST") {
    const result = schema.validate(req.body);
    if (result.error) {
      res.status(400).json({ message: result.error.details[0].message });
      return;
    }

    const newEvent = await prisma.event.create({
      data: {
        ...req.body,
      },
    });

    res.json(newEvent);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
