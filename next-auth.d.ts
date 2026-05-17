import "next-auth/jwt";

declare module "next-auth/jwt" {
    interface JWT {
        accessTokenExpires?: number;
        accessToken?: string;  // Included if you're also storing the raw token
        refreshToken?: string; // Included if you're doing refresh token rotation
    }
}