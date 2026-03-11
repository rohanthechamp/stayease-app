'use client'

import React, {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useState,
} from "react";

type DateRange = {
    from: Date | undefined;
    to: Date | undefined;
};

type ReservationContextType = {
    range: DateRange;
    setRange: React.Dispatch<React.SetStateAction<DateRange>>;
    resetRange:()=> void,
};

const ReservationContext = createContext<ReservationContextType | null>(
    null
);

const initialState: DateRange = { from: undefined, to: undefined };

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