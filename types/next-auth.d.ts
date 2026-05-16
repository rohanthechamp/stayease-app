import NextAuth, {
    DefaultSession,
} from "next-auth";

declare module "next-auth" {

    interface Session {

        accessToken?: string;
        refreshToken?: string;

        user: {
            guestId?: number;
            nationalID?: string;
            nationality?: string;
            countryFlag?: string;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {

    interface JWT {

        accessToken?: string;
        refreshToken?: string;

        guestId?: number;

        nationalID?: string;

        nationality?: string;

        countryFlag?: string;
    }
}