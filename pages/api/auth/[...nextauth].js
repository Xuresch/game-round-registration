import EmailProvider from "next-auth/providers/email";
import NextAuth from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

import CustomPrismaAdapterForNextAuth from "@/lib/CustomPrismaAdapterForNextAuth";

export default async function auth(req, res) {
  // Do whatever you want here, before the request is passed down to `NextAuth`

  return await NextAuth(req, res, {
    //   adapter: PrismaAdapter(prisma),
    adapter: CustomPrismaAdapterForNextAuth(prisma),
    providers: [
      EmailProvider({
        server: {
          host: process.env.EMAIL_SERVER_HOST,
          port: process.env.EMAIL_SERVER_PORT,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        },
        from: process.env.EMAIL_FROM,
      }),
    ],
    // callbacks: {
    //   signIn: async (user, account, profile, email, credentials) => {
    //     console.log("signIn", user, account, profile, email, credentials);
    //     return true;
    //   },
    // },
  });
}
