"use client";

import React, { useEffect, useRef, useState } from "react";
// import usLogo from "@/public/usFlag.png";
import Image from "next/image";
import { useUser } from "../_context/UserDataContext";
import { Country } from "@/types/booking";
import { handleFormAction } from "../_lib/action";
import { useSession } from "next-auth/react";
import { useFormStatus } from "react-dom";

type Props = {
    children: React.ReactNode;
    data: Country[];
};

const UpdateProfileForm = ({ children, data }: Props) => {
    const { pending } = useFormStatus();

    const resetRef = useRef<HTMLFormElement | null>(null);
    const { data: session, update } = useSession(); // You'll need to import this
    const { user } = useUser();
    const [selectedCountry, setSelectedCountry] = useState<string>(() => {
        const saved = localStorage.getItem("userSelectedCountry") || '';
        return saved;
    });
    // const [isSubmit, setIsSubmit] = useState(false);

    // Load from localStorage after mount
    useEffect(() => {
        const saved = localStorage.getItem("userSelectedCountry");
        if (saved) setSelectedCountry(saved);
    }, []);
    useEffect(() => {
        if (session?.user?.nationality) {
            localStorage.setItem("userSelectedCountry", session?.user?.nationality);
        }
        // setIsSubmit((prev)=>!prev)
    }, [selectedCountry, session]);

    const flag =
        data.find((country) => country.name === selectedCountry)?.flag ??
        session?.user?.countryFlag;

    console.log("SESSION HERE- ", session?.user);

    return (
        <form
            ref={resetRef}
            className="bg-sky-600 py-8 px-12 text-lg flex gap-6 flex-col"
            action={async (formData) => {
                // 1. Run the server-side update
                await handleFormAction(formData);
                // 2. Refresh the client-side session
                // You can pass new data here to update the session immediately
                await update();
                resetRef.current?.reset();
            }}
        >
            {/* Full Name */}
            <div className="space-y-2">
                <label>Full name</label>
                <input
                    value={user?.name ?? ""}
                    disabled
                    className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
                />
            </div>

            {/* Email */}
            <div className="space-y-2">
                <label>Email address</label>
                <input
                    value={user?.email ?? ""}
                    disabled
                    className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
                />
            </div>

            {/* Hidden field for country */}
            <input type="hidden" name="logo" value={flag} />

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label htmlFor="nationality">Where are you from?</label>

                    {selectedCountry && flag ? (
                        <Image
                            src={flag as string}
                            alt="Country flag"
                            className="h-5 rounded-sm"
                            width={30}
                            height={20}
                        />
                    ) : null}
                </div>

                {React.cloneElement(children as React.ReactElement, {
                    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                        const value = e.target.value;
                        const [cou, code] = value.split("%");
                        setSelectedCountry(cou);
                    },
                    defaultCountry: selectedCountry,
                })}
            </div>
            {/* )} */}

            {/* National ID */}
            <div className="space-y-2">
                <label htmlFor="nationalID">National ID number</label>
                <input
                    name="nationalID"
                    id="nationalID"
                    // 1. Logic: Check if value exists
                    // 2. Styling: If value exists, we use a subtle border/bg change
                    className={`px-5 py-3 w-full shadow-sm rounded-sm transition-all duration-300 
            ${session?.user?.nationalID
                            ? "bg-primary-100 border-2 border-green-600 text-primary-900"
                            : "bg-primary-200 text-primary-800 border border-transparent"
                        }`}
                    defaultValue={session?.user?.nationalID || ""}
                    placeholder="Enter your national ID..."
                />

                {/* Optional: Subtle helper text for the user */}
                {session?.user?.nationalID && (
                    <p className="text-lg text-green-800 font-medium">
                        ✓ Identity verified on file. You can edit this if needed.
                    </p>
                )}
            </div>
            <div className="flex justify-end items-center gap-6">
                <button
                    disabled={pending}
                    className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold
        hover:bg-accent-600 transition-all
        disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300
        flex items-center justify-center gap-2"
                >
                    {pending ? <p>`"Submitting......."`</p> : "Submit"}
                </button>
            </div>
        </form>
    );
};
export default UpdateProfileForm;
