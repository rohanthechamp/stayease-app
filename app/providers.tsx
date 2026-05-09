"use client";

import { SessionProvider } from "next-auth/react";
import { UserProvider } from "@/app/_context/UserDataContext";
import { ReservationProvider } from "./_context/ReservatationContext";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <UserProvider>
                <ReservationProvider>
                    {children}
                </ReservationProvider>
            </UserProvider>
        </SessionProvider>
    );
}