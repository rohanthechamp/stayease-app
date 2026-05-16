/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { createGuest, getGuest, getJwtTokens } from "@/app/_lib/data-service";

import { refreshAccessToken } from "@/app/_lib/helpers";
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
        // GOOGLE LOGIN
        async signIn({ user }) {
            try {
                const existingGuest = await getGuest(user.email);

                console.log("EXISTING GUEST:", existingGuest);
                // CREATE GUEST IF NOT EXISTS
                if (!existingGuest || existingGuest === null) {
                    console.log("No guest found so creating new guest");
                    await createGuest({
                        email: user.email,
                        fullName: user.name,
                        isOAuthUser: true,
                    });
                }
                console.log("EXISTING GUEST: returning data", existingGuest);
                return true;
            } catch (error) {
                console.log("ERROR on LOGIN", error);

                return false;
            }
        },

        // NEXTAUTH JWT CALLBACK
        async jwt({ token, user, trigger }) {
            // RUN ONLY AFTER LOGIN
            if (user) {
                // GET GUEST DATA
                console.log("User email", user.email);
                const guest = await getGuest(user.email);

                console.log("gettied guest", guest);
                const jwtData = await getJwtTokens(user.email);
                console.log("jwtData", jwtData);

                // STORE DRF TOKENS INSIDE NEXTAUTH TOKEN

                token.accesstoken = jwtData.data.accesstoken;
                token.refreshtoken = jwtData.data.refreshtoken;
                token.accessTokenExpires = Date.now() + 15 * 60 * 1000;
                // STORE GUEST DATA

                token.guestId = guest?.id || null;

                token.nationalID = guest?.nationalID || '';

                token.nationality = guest?.nationality || '';

                token.countryFlag = guest?.countryFlag || '';
            }

            // refreshing jwt accesstoken


            if (!token.accessTokenExpires) {
                return token;
            }

            if (Date.now() > token.accessTokenExpires) {
                console.log("Token expired → refreshing");
                return await refreshAccessToken(token);
            }




            // SESSION UPDATE
            if (trigger === "update") {
                const guest = await getGuest(token.email);

                token.nationalID = guest?.nationalID;

                token.nationality = guest?.nationality;

                token.countryFlag = guest?.countryFlag;
            }

            return token;
        },

        // SESSION CALLBACK
        async session({ session, token }) {
            session.user.guestId = token.guestId;

            session.user.nationalID = token.nationalID;

            session.user.nationality = token.nationality;

            session.user.countryFlag = token.countryFlag;

            // EXPOSE DRF JWT TOKENS
            session.accesstoken = token.accesstoken;

            session.refreshtoken = token.refreshtoken;

            return session;
        },
    },

    pages: {
        signIn: "/signin",
        error: "/signin",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
