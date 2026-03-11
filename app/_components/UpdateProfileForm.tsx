"use client";

// import React, { useEffect, useState } from "react";
import React, { useState } from "react";

import usLogo from "@/public/usFlag.png";
import Image from "next/image";
// import { Country } from "@/types/booking";

type Props = {
    children: React.ReactNode;
    // data: Country[];
};

const UpdateProfileForm = ({ children }: Props) => {
    const [count, setCount] = useState();

  // CHANGE
  const countryFlag = "pt.jpg";
  const nationality = "portugal";
    // const [selectedCountry, setSelectedCountry] = useState(() => {
    //     const saved = sessionStorage.getItem("userSelectedCountry");
    //     return saved ? saved : "us";
    // });

    // useEffect(() => {
    //     sessionStorage.setItem('userSelectedCountry', selectedCountry)
    // }, [selectedCountry]);

    // const flag = data.find((country) => country.code === "us")?.flag ?? usLogo;
    // console.log('selectedCountry value - ', selectedCountry)

    // const handleForm = (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();
    //     const data = new FormData(event.currentTarget);
    //     // const formData=Object.fromEntries(data)
    //     const userNationality = data.get("nationality") as string;
    //     localStorage.setItem('userSelectedCountry', userNationality.split('%')[0])

    //     // // selectedCountry.current=userNationality.split('%')[0];
    //     console.log("User selected form data:- ", selectedCountry);
    // };
    return (
        <form
            className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
        // onSubmit={handleForm}
        >
            <div className="space-y-2">
                <label>Full name</label>
                <input
                    disabled
                    className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
                />
            </div>

            <div className="space-y-2">
                <label>Email address</label>
                <input
                    disabled
                    className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label htmlFor="nationality">Where are you from?</label>
                    <Image
                        src={ usLogo}
                        alt="Country flag"
                        className="h-5 rounded-sm"
                        width={100}
                        height={100}
                    />
                </div>
                {/* {React.cloneElement(children as React.ReactElement, {
                    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                        const value = e.target.value;
                        const [, code] = value.split("%");
                        setSelectedCountry(code);
                    },
                })} */}

                {children}
            </div>

            <div className="space-y-2">
                <label htmlFor="nationalID">National ID number</label>
                <input
                    name="nationalID"
                    className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
                />
            </div>

            <div className="flex justify-end items-center gap-6">
                <button className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300">
                    Update profile
                </button>
            </div>
        </form>
    );
};

export default UpdateProfileForm;
