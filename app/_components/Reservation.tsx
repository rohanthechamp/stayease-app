import React from "react";
import ReservationForm from "./ReservationForm";
import DateSelector from "./DateSelector";
import { getCabinBookedDates, getSettings } from "../_lib/data-service";
import { Cabin } from "@/types/cabin";

const Reservation = async ({ Cabin }: { Cabin: Cabin }) => {
    const [settings, bookedDates] = await Promise.all([
        getSettings(),
        getCabinBookedDates(Cabin.id),
    ]);
    console.log('bookedDates', bookedDates);
    return (
        <div className="grid-cols-2 border- border-primary-800 min-h-[400px]">
            <ReservationForm cabin={Cabin} bookedDates={bookedDates} />
            <DateSelector
                settings={settings}
                bookedDates={bookedDates}
                cabin={Cabin}
            />
        </div>
    );
};

export default Reservation;
