// pages/api/storeTempUserData.js
import prisma from "@/lib/prisma";

export default async function tempUserDataHandler(req, res) {
  console.log("tempUserDataHandler", req.method, req.body);
  if (req.method === "POST") {
    const { email, userName } = req.body;

    try {
      await prisma.tempUserData.create({
        data: {
          email,
          userName,
        },
      });
      return res.status(200).json({ message: "Data stored successfully." });
    } catch (error) {
      console.error("Error storing data:", error); // Log the error
      return res.status(500).json({ error: "Failed to store data." });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
