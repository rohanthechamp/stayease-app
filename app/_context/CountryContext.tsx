"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type CountryContextType = {
    selectedCountry: string;
    setSelectedCountry: (country: string) => void;
};

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: ReactNode }) {
    const [selectedCountry, setSelectedCountry] = useState("us");

    return (
        <CountryContext.Provider value={{ selectedCountry, setSelectedCountry }}>
            {children}
        </CountryContext.Provider>
    );
}

export function useCountry() {
    const context = useContext(CountryContext);

    if (!context) {
        throw new Error("useCountry must be used inside CountryProvider");
    }

    return context;
}