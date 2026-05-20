import GoogleProvider from "next-auth/providers/google";
import { createGuest, getGuest, getJwtTokens } from "@/app/_lib/data-service";
import { refreshAccessToken } from "@/app/_lib/helpers";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    // Call your clean Django GuestLoginView endpoint
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}guest_portal/auth/login/`, {
                        method: 'POST',
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password
                        }),
                        headers: { "Content-Type": "application/json" }
                    });


                    const data = await res.json();
                    console.log('data',data)

                    if (!res.ok || !data.tokens) {
                        throw new Error(data.error || "Invalid email or password");
                    }

                    // Return an object that matches the NextAuth 'User' interface 
                    // and attach your explicit DRF tokens directly to it
                    return {
                        id: data.guest.id.toString(),
                        name: data.guest.fullName,
                        email: data.guest.email,
                        tokens: data.tokens, // Passing tokens downstream to the jwt() callback
                    };
                } catch (error: any) {
                    throw new Error(error.message || "Authentication failed");
                }
            }
        })

    ],


    session: {
        strategy: "jwt",
    },

    callbacks: {
        async signIn({ user }) {
            // 1. Guard clause: Ensure an email actually exists
            if (!user.email) return false;

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
            } catch {
                return false;
            }
        },
        async jwt({ token, user, trigger }) {
            // 1. Check for user AND ensure user.email exists
            if (user && user.email) {
                const guest = await getGuest(user.email);
                const jwtData = await getJwtTokens({ email: user.email, isOAuthUser: true });

                token.accesstoken = jwtData.data.accesstoken;
                token.refreshtoken = jwtData.data.refreshtoken;
                token.accessTokenExpires = Date.now() + 15 * 60 * 1000;

                token.guestId = guest.id;
                token.nationalID = guest?.nationalID || "";
                token.nationality = guest?.nationality || "";
                token.countryFlag = guest?.countryFlag || "";
            }

            // Checking token expiration type safety
            if (typeof token.accessTokenExpires === "number" && Date.now() > token.accessTokenExpires) {
                return await refreshAccessToken(token);
            }

            // 2. Check for update trigger AND ensure token.email exists
            if (trigger === "update" && token.email) {
                const guest = await getGuest(token.email);

                // Standardizing fallbacks to match the strings above
                token.nationalID = guest?.nationalID || "";
                token.nationality = guest?.nationality || "";
                token.countryFlag = guest?.countryFlag || "";
            }

            return token;
        },

        async session({ session, token }) {
            session.user.guestId = token.guestId as number;
            session.user.nationalID = token.nationalID as string;
            session.user.nationality = token.nationality as string;
            session.user.countryFlag = token.countryFlag as string;

            // Cast the tokens as strings to satisfy 'string | undefined'
            session.accessToken = token.accesstoken as string;
            session.refreshToken = token.refreshtoken as string;

            return session;
        },
    },

    pages: {
        signIn: "/signin",
        error: "/signin",
    },
};