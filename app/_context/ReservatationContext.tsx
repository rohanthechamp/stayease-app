'use client'

import React, {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useState,
} from "react";

export type AppDateRange  = {
    from: Date | undefined;
    to?: Date | undefined;
    nights?: number|undefined
};

type ReservationContextType = {
    range: AppDateRange ;
    setRange: React.Dispatch<React.SetStateAction<AppDateRange >>;
    resetRange:()=> void,
};

const ReservationContext = createContext<ReservationContextType | null>(
    null
);

const initialState: AppDateRange  = { from: undefined, to: undefined, nights: undefined };

function ReservationProvider({ children }: PropsWithChildren) {
    const [range, setRange] = useState(initialState);
    const resetRange = useCallback(() => {
        setRange(initialState);
    }, []);

    return (
        <ReservationContext.Provider value={{ range, setRange, resetRange }}>
            {children}
        </ReservationContext.Provider>
    );
}

function useReservation() {
    const context = useContext(ReservationContext);

    if (!context)
        throw new Error("useReservation must be used within ReservationProvider");

    return context;
}

export { ReservationProvider, useReservation };

