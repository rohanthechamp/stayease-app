"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import { createGuest } from "../_lib/data-service";

function RegisterPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        passwordConfirm: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRegister = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (formData.password !== formData.passwordConfirm) {
            setError("Passwords do not match");
            return;
        }

        try {
            setIsLoading(true);

            const response = await createGuest({ fullName: formData.fullName, email: formData.email, password: formData.password, passwordConfirm: formData.passwordConfirm, isOAuthUser: false })


            if (!response.success) {
                throw new Error("Invalid email or password");
            }

            setSuccess("Account created successfully");

            setFormData({
                fullName: "",
                email: "",
                password: "",
                passwordConfirm: "",
            });

            setTimeout(() => {
                window.location.href = "/signin";
            }, 1500);

        } catch (error) {
            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/bg.png"
                    alt="The Wild Oasis"
                    fill
                    className="object-cover"
                    priority
                />

                <div className="absolute inset-0 bg-gradient-to-br from-primary-950/90 via-primary-900/80 to-primary-950/90" />
            </div>

            {/* Decorative blur */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl animate-pulse" />

            <div
                className="absolute bottom-20 right-10 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "1s" }}
            />

            {/* Card */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">

                    {/* Header */}
                    <div className="px-8 pt-10 pb-6 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-accent-500/30 rounded-full blur-xl animate-pulse" />

                                <Image
                                    src={logo}
                                    alt="The Wild Oasis"
                                    width={80}
                                    height={80}
                                    className="relative rounded-2xl shadow-lg"
                                    priority
                                />
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
                            Create Guest Account
                        </h1>

                        <p className="text-primary-100/80 text-lg leading-relaxed">
                            Register to manage bookings and access your personalized dashboard.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="px-8 pb-10">
                        <form
                            onSubmit={handleRegister}
                            className="space-y-5"
                        >
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your full name"
                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-primary-200/50 outline-none focus:border-accent-400"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email"
                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-primary-200/50 outline-none focus:border-accent-400"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Create a password"
                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-primary-200/50 outline-none focus:border-accent-400"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    name="passwordConfirm"
                                    value={formData.passwordConfirm}
                                    onChange={handleChange}
                                    required
                                    placeholder="Confirm your password"
                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-primary-200/50 outline-none focus:border-accent-400"
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <p className="text-sm text-red-400">
                                    {error}
                                </p>
                            )}

                            {/* Success */}
                            {success && (
                                <p className="text-sm text-green-400">
                                    {success}
                                </p>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-xl bg-accent-500 hover:bg-accent-400 text-white font-semibold py-4 transition-all duration-300 disabled:opacity-60"
                            >
                                {isLoading
                                    ? "Creating account..."
                                    : "Create Account"}
                            </button>
                        </form>

                        {/* Login Link */}
                        <p className="text-center text-primary-200/70 text-sm mt-6">
                            Already have an account?{" "}
                            <Link
                                href="/signin"
                                className="text-accent-400 hover:text-accent-300 font-medium"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back */}
                <div className="text-center mt-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-primary-200/70 hover:text-white transition-colors text-sm"
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

export default RegisterPage;