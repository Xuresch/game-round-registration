import { PrismaAdapter } from "@auth/prisma-adapter";

/** @return { import("next-auth/adapters").Adapter } */
export default function CustomPrismaAdapterForNextAuth(prisma) {
  const adapter = PrismaAdapter(prisma);

  adapter.createUser = async (data) => {

    // console.log("createUser", data);

    const userExist = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (userExist) {
      return userExist;
    }

    // Fetch the temporary name from the database
    let tempData;
    try {
        tempData = await prisma.tempUserData.findUnique({
          where: {
            email: data.email,
          },
        });
      } catch (error) {
        console.log("Error fetching temp data:", error);
      }

    // console.log("tempData", tempData);

    let userName;
    if (tempData) {
      userName = tempData.userName;

      // Optionally, delete the temporary data now that it's used
      await prisma.tempUserData.delete({
        where: {
          email: data.email,
        },
      });
    }

    return prisma.user.create({
      data: {
        email: data.email,
        userName: userName || data.email.split("@")[0],
        emailVerified: data.emailVerified,
      },
    });
  };

  return adapter;
}
