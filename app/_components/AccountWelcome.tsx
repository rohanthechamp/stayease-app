"use client";

import React, { useEffect } from "react";

interface AccountWelcomeProps {
    session: any; // Replace with your explicit NextAuth Session type if available
}

const AccountWelcome: React.FC<AccountWelcomeProps> = ({ session }) => {
    // Extracting the name safely with fallback handling
    const fullName = session?.user?.name || "User";
    const nameParts = fullName.split(" ");
    // Fallback to first name if the 3rd word (index 2) doesn't exist
    const displayedName = nameParts[2] || nameParts[0];

    // Safely handling localStorage inside a useEffect for SSR compatibility
    useEffect(() => {

        if (session?.accesstoken) {
            console.log('AccountWelcome ☺️☺️☺️')
            localStorage.setItem("accesstoken", session.accesstoken);
        }
    }, [session?.accesstoken]);

    return (
        <div className="w-full max-w-4xl mx-auto my-6 animate-fade-in">
            {/* Premium Dashboard Header Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800 p-8 md:p-10 shadow-2xl">

                {/* Subtle Background Radial Glow */}
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-500/10 blur-3xl" />
                <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-zinc-500/5 blur-3xl" />

                <div className="relative flex flex-col md:flex-row items-center gap-6 justify-between">
                    <div className="space-y-2 text-center md:text-left">
                        {/* Tag/Badge */}
                        <span className="inline-flex items-center rounded-full bg-accent-500/10 px-3 py-1 text-xs font-medium text-accent-400 border border-accent-500/20 tracking-wider uppercase mb-2">
                            User Dashboard
                        </span>

                        {/* Modern Welcoming Heading */}
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                            Welcome back,{" "}
                            <span className="bg-gradient-to-r from-accent-400 via-accent-300 to-white bg-clip-text text-transparent">
                                {displayedName}
                            </span>
                            <span className="ml-2 inline-block animate-wave">👋</span>
                        </h2>

                        <p className="text-zinc-400 text-sm md:text-base max-w-md">
                            Manage your profile details, secure tokens, and view your current account activities.
                        </p>
                    </div>

                    {/* Sleek Profile Minimalist Avatar Grid Accent */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xl font-bold shadow-inner">
                        {displayedName[0].toUpperCase()}
                    </div>
                </div>

                {/* Bottom subtle divider and status */}
                <div className="mt-8 pt-6 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
                    <div>Session verified via NextAuth</div>
                    <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        Secure State Sync
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountWelcome;