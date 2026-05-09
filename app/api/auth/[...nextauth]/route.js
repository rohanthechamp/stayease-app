/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { createGuest, getGuest } from "@/app/_lib/data-service";
export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async signIn({ user }) {
            try {
                const existingGuest = await getGuest(user.email);

                if (!existingGuest) {
                    await createGuest({
                        email: user.email,
                        fullName: user.name,
                    });
                }

                return true;
            } catch (error) {
                console.log("ERROR on LOGIN", error.message || error);
                return false;
            }
        },

        async jwt({ token, user, trigger, session }) {
            if (user) {
                const guest = await getGuest(user.email);

                token.guestId = guest?.id || null;
                token.nationalID = guest?.nationalID || null;
                token.nationality = guest?.nationality || null;
                token.countryFlag = guest?.countryFlag || null;
            }

            if (trigger === "update") {
                const guest = await getGuest(token.email); // Re-fetch fresh data from DB
                token.nationalID = guest?.nationalID;
                token.nationality = guest?.nationality;
                token.countryFlag = guest?.countryFlag;
            }

            return token;
        },

        async session({ session, token }) {
            session.user.guestId = token.guestId;
            session.user.nationalID = token.nationalID;
            session.user.nationality = token.nationality;
            session.user.countryFlag = token.countryFlag;

            return session;
        },
    },

    pages: {
        signIn: "/login",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
