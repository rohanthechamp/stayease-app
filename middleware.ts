import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // You can inspect token here if needed
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                // Only allow if token exists
                return !!token?.accessToken;
            },
        },
    }
);

export const config = {
    matcher: ["/account/:path*"],
};