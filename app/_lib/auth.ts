import GoogleProvider from "next-auth/providers/google";
import { createGuest, getGuest, getJwtTokens } from "@/app/_lib/data-service";
import { refreshAccessToken } from "@/app/_lib/helpers";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async signIn({ user }: { user: any }) {
            try {
                const existingGuest = await getGuest(user.email);

                if (!existingGuest) {
                    await createGuest({
                        email: user.email,
                        fullName: user.name,
                        isOAuthUser: true,
                    });
                }

                return true;
            } catch (error) {
                console.log("ERROR on LOGIN", error);
                return false;
            }
        },

        async jwt({ token, user, trigger }: any) {
            if (user) {
                const guest = await getGuest(user.email);
                const jwtData = await getJwtTokens(user.email);

                token.accesstoken = jwtData.data.accesstoken;
                token.refreshtoken = jwtData.data.refreshtoken;
                token.accessTokenExpires = Date.now() + 15 * 60 * 1000;

                token.guestId = guest?.id || null;
                token.nationalID = guest?.nationalID || "";
                token.nationality = guest?.nationality || "";
                token.countryFlag = guest?.countryFlag || "";
            }

            if (token.accessTokenExpires && Date.now() > token.accessTokenExpires) {
                return await refreshAccessToken(token);
            }
            if (trigger === "update") {
                const guest = await getGuest(token.email);

                token.nationalID = guest?.nationalID;

                token.nationality = guest?.nationality;

                token.countryFlag = guest?.countryFlag;
            }

            return token;
        },

        async session({ session, token }: any) {
            session.user.guestId = token.guestId;
            session.user.nationalID = token.nationalID;
            session.user.nationality = token.nationality;
            session.user.countryFlag = token.countryFlag;

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