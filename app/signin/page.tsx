"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
function SignInPage() {
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    // Google OAuth Login
    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true);
            await signIn("google", { callbackUrl: "/account" });


        } catch (error) {
            console.error("Sign in failed:", error);
        } finally {
            setIsLoading(false);
        }
    };


    // DRF JWT Credentials Login
    const handleCredentialsLogin = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            setError("");

            console.log(email, password)

            // const response = await createGuest({ email: email, password: password })
            const result = await signIn("credentials", {
                redirect: false, // Prevents automatic harsh reloads
                email: email,
                password: password,
            });



            if (result?.error) {
                // NextAuth catches the 'throw new Error' from authorize() and assigns it here
                throw new Error(result.error);
            }

            // SPA-friendly client redirect, context remains clean
            router.push("/account");
            router.refresh(); 

        } catch (error) {
            console.error(error);
            setError("Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-primary-950">
            {/* Soft decorative ambient glow */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl animate-pulse" />
            <div
                className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "1.5s" }}
            />

            {/* Card */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-primary-900 border border-primary-800 rounded-3xl shadow-xl overflow-hidden p-8 space-y-8">

                    {/* Header */}
                    <div className="text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="relative flex items-center justify-center w-16 h-16 bg-accent-500 rounded-2xl shadow-md">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    className="w-8 h-8 text-primary-950 stroke-[2.5]"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 12h16.5m-16.5 0a2.25 2.25 0 0 1 2.25-2.25h12a2.25 2.25 0 0 1 2.25 2.25m-16.5 0v3.75m16.5-3.75v3.75m-12-3.75V9.75A2.25 2.25 0 0 1 8.25 7.5h7.5a2.25 2.25 0 0 1 2.25 2.25v2.25m-10.5 3.75h10.5"
                                    />
                                </svg>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-light text-primary-100 tracking-tight">
                                Welcome to StayEase
                            </h1>
                            <p className="text-primary-300 text-sm">
                                Sign in to access your bookings and guest dashboard.
                            </p>
                        </div>
                    </div>

                    {/* Features summary */}
                    <div className="space-y-2.5 bg-primary-950 border border-primary-800 rounded-2xl p-4">
                        {[
                            "Easy cabin booking",
                            "Exclusive member deals",
                            "Manage your reservations",
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 text-primary-200"
                            >
                                <div className="w-5 h-5 rounded-full bg-accent-500/10 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                                </div>
                                <span className="text-xs font-medium">
                                    {feature}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Google OAuth Option */}
                    <div>
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className="group w-full relative bg-accent-500 hover:bg-accent-600 text-primary-950 font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden flex items-center justify-center gap-3 text-sm"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-primary-950/30 border-t-primary-950 rounded-full animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    <span>Continue with Google</span>
                                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 text-xs text-primary-400">
                        <div className="flex-1 h-px bg-primary-800" />
                        <span>or continue with email</span>
                        <div className="flex-1 h-px bg-primary-800" />
                    </div>

                    {/* Email/Password Credentials form */}
                    <form
                        onSubmit={handleCredentialsLogin}
                        className="space-y-4 text-left"
                    >
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-primary-300 uppercase tracking-wider">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your email"
                                className="w-full rounded-xl border border-primary-800 bg-primary-950 px-4 py-3 text-primary-100 placeholder:text-primary-500 outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 text-sm transition-all"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-primary-300 uppercase tracking-wider">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                                className="w-full rounded-xl border border-primary-800 bg-primary-950 px-4 py-3 text-primary-100 placeholder:text-primary-500 outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 text-sm transition-all"
                            />
                        </div>

                        {error && (
                            <p className="text-xs text-red-500 font-medium">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-xl bg-primary-800 text-primary-100 border border-primary-700 py-3 text-sm font-semibold hover:bg-primary-700 transition disabled:opacity-60"
                        >
                            {isLoading ? "Signing in..." : "Sign in with Email"}
                        </button>
                    </form>

                    <p className="text-center text-primary-500 text-[10px] leading-relaxed">
                        By signing in, you agree to our Terms of Service and Privacy Policy.
                    </p>

                </div>

                {/* Back to home */}
                <div className="text-center mt-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-primary-300 hover:text-accent-500 transition-colors text-sm font-medium"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;
// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import logo from "@/public/logo.png";
// import { ArrowRightIcon } from "@heroicons/react/24/outline";
// import { signIn } from "next-auth/react";

// function SignInPage() {
//     const [isLoading, setIsLoading] = useState(false);


//     const handleSignIn = async () => {
//         try {
//             setIsLoading(true);
//             await signIn("google", { callbackUrl: "/account" });


//         } catch (error) {
//             console.error("Sign in failed:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
//             {/* Background Image */}
//             <div className="absolute inset-0 z-0">
//                 <Image
//                     src="/bg.png"
//                     alt="The Wild Oasis"
//                     fill
//                     className="object-cover"
//                     priority
//                 />

//                 <div className="absolute inset-0 bg-gradient-to-br from-primary-950/90 via-primary-900/80 to-primary-950/90" />

//                 {/* Pattern overlay */}
//                 <div
//                     className="absolute inset-0 opacity-10"
//                     style={{
//                         backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM36 4V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//                     }}
//                 />
//             </div>

//             {/* Animated Background */}
//             <div className="absolute top-20 left-10 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl animate-pulse" />
//             <div
//                 className="absolute bottom-20 right-10 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl animate-pulse"
//                 style={{ animationDelay: "1s" }}
//             />

//             {/* Card */}
//             <div className="relative z-10 w-full max-w-md mx-4">
//                 <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
//                     {/* Header */}
//                     <div className="px-8 pt-10 pb-6 text-center">
//                         <div className="flex justify-center mb-6">
//                             <div className="relative">
//                                 <div className="absolute inset-0 bg-accent-500/30 rounded-full blur-xl animate-pulse" />
//                                 <Image
//                                     src={logo}
//                                     alt="The Wild Oasis"
//                                     width={80}
//                                     height={80}
//                                     className="relative rounded-2xl shadow-lg"
//                                     priority
//                                 />
//                             </div>
//                         </div>

//                         <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
//                             Welcome to The Wild Oasis
//                         </h1>

//                         <p className="text-primary-100/80 text-lg leading-relaxed">
//                             Your perfect cabin getaway awaits. Sign in to unlock exclusive
//                             access to booking your dream vacation.
//                         </p>
//                     </div>

//                     {/* Features */}
//                     <div className="px-8 py-4">
//                         <div className="grid gap-3">
//                             {[
//                                 "Easy cabin booking",
//                                 "Exclusive member deals",
//                                 "Manage your reservations",
//                             ].map((feature, index) => (
//                                 <div
//                                     key={index}
//                                     className="flex items-center gap-3 text-primary-50/70"
//                                 >
//                                     <div className="w-5 h-5 rounded-full bg-accent-500/30 flex items-center justify-center">
//                                         <div className="w-2 h-2 rounded-full bg-accent-400" />
//                                     </div>
//                                     <span className="text-sm font-medium">{feature}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Divider */}
//                     <div className="px-8 py-4">
//                         <div className="flex items-center gap-4">
//                             <div className="flex-1 h-px bg-white/10" />
//                             <span className="text-primary-200/50 text-sm">continue with</span>
//                             <div className="flex-1 h-px bg-white/10" />
//                         </div>
//                     </div>

//                     {/* Google Button */}
//                     <div className="px-8 pb-10">
//                         <button
//                             onClick={handleSignIn}
//                             disabled={isLoading}
//                             className="group w-full relative bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-400 hover:to-accent-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-accent-500/25 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden"
//                         >
//                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

//                             <div className="relative flex items-center justify-center gap-3">
//                                 {isLoading ? (
//                                     <>
//                                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                                         <span>Signing in...</span>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <svg className="w-5 h-5" viewBox="0 0 24 24">
//                                             <path
//                                                 fill="currentColor"
//                                                 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                                             />
//                                             <path
//                                                 fill="currentColor"
//                                                 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                                             />
//                                             <path
//                                                 fill="currentColor"
//                                                 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                                             />
//                                             <path
//                                                 fill="currentColor"
//                                                 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                                             />
//                                         </svg>

//                                         <span>Continue with Google</span>

//                                         <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                                     </>
//                                 )}
//                             </div>
//                         </button>

//                         <p className="text-center text-primary-200/60 text-sm mt-6">
//                             By signing in, you agree to our{" "}
//                             <a className="text-accent-400 hover:text-accent-300 underline underline-offset-2">
//                                 Terms of Service
//                             </a>{" "}
//                             and{" "}
//                             <a className="text-accent-400 hover:text-accent-300 underline underline-offset-2">
//                                 Privacy Policy
//                             </a>
//                         </p>
//                     </div>
//                 </div>

//                 {/* Back link */}
//                 <div className="text-center mt-6">
//                     <Link
//                         href="/"
//                         className="inline-flex items-center gap-2 text-primary-200/70 hover:text-white transition-colors text-sm"
//                     >
//                         <svg
//                             className="w-4 h-4"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M10 19l-7-7m0 0l7-7m-7 7h18"
//                             />
//                         </svg>
//                         Back to home
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default SignInPage;
