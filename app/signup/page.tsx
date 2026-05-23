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


            if (response.success) {
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

            }
            if (!response.success) {
                throw new Error("Invalid email or password. Try again");
            }





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
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-primary-950">
            {/* Ambient decorative glow */}
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
                                Create Account
                            </h1>
                            <p className="text-primary-300 text-sm">
                                Register to manage bookings and access your guest dashboard.
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleRegister}
                        className="space-y-4 text-left"
                    >
                        {/* Full Name */}
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-primary-300 uppercase tracking-wider">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                placeholder="Enter your full name"
                                className="w-full rounded-xl border border-primary-800 bg-primary-950 px-4 py-3 text-primary-100 placeholder:text-primary-500 outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 text-sm transition-all"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-primary-300 uppercase tracking-wider">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                                className="w-full rounded-xl border border-primary-800 bg-primary-950 px-4 py-3 text-primary-100 placeholder:text-primary-500 outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 text-sm transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-primary-300 uppercase tracking-wider">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Create a password"
                                className="w-full rounded-xl border border-primary-800 bg-primary-950 px-4 py-3 text-primary-100 placeholder:text-primary-500 outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 text-sm transition-all"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-primary-300 uppercase tracking-wider">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="passwordConfirm"
                                value={formData.passwordConfirm}
                                onChange={handleChange}
                                required
                                placeholder="Confirm your password"
                                className="w-full rounded-xl border border-primary-800 bg-primary-950 px-4 py-3 text-primary-100 placeholder:text-primary-500 outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 text-sm transition-all"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-xs text-red-500 font-medium">
                                {error}
                            </p>
                        )}

                        {/* Success */}
                        {success && (
                            <p className="text-xs text-green-600 font-medium">
                                {success}
                            </p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-xl bg-accent-500 hover:bg-accent-600 text-primary-950 font-semibold py-3.5 transition-all duration-300 disabled:opacity-60 text-sm shadow-sm hover:shadow-md"
                        >
                            {isLoading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center text-primary-300 text-xs mt-6">
                        Already have an account?{" "}
                        <Link
                            href="/signin"
                            className="text-accent-500 hover:text-accent-600 font-semibold underline underline-offset-2"
                        >
                            Sign in
                        </Link>
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

export default RegisterPage;