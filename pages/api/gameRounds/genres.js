import { PrismaClient } from "@prisma/client"; // Assuming you're using Prisma as your database client

const prisma = new PrismaClient();

export default async function handle(req, res) {
  if (req.method === "GET") {
    // Fetch genres from the database
    const genres = await prisma.genre.findMany();
    res.status(200).json(genres);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
