import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import permissions from "./permissions";

const requireAuthOrOwnership = async (
  objectType,
  objectId,
  action,
  req,
  res
) => {

  console.log("req", req);

  const session = await getSession({ req });

  console.log("session", session);

  if (!session) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }

  const allowedRoles = permissions[objectType][action];

  // Check if the user has one of the allowed roles
  if (allowedRoles.includes(session.user.role)) {
    return true;
  }

  // If one of the allowed roles is 'owner', check ownership
  if (allowedRoles.includes("owner")) {
    const object = await prisma[objectType].findUnique({
      where: { id: objectId },
    });

    if (object && object.id === session.user.id) {
      return true;
    }
  }

  res.status(403).json({ error: "Not authorized" });
  return false;
};

export default requireAuthOrOwnership;
