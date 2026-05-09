"use client";
import { BookingAPI } from "@/types/booking";
import React, { useOptimistic, useState } from "react";
import ReservationCard from "./ReservationCard";
import { handleBookingDeleteFormAction } from "../_lib/action";


const ReservationList = ({ bookings }: { bookings: BookingAPI[] }) => {
  const [error, setError] = useState<string | null | undefined>(null)
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (state, bookingId) => {
      return state.filter((data) => data.id !== bookingId);
    },
  );

  async function handleDelete(bookingId: number) {
    optimisticDelete(bookingId);
    const response = await handleBookingDeleteFormAction(bookingId);
    setError(response.message)
  }
  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          key={booking.id}
          onDelete={handleDelete}
          errorMsg={error}
        />
      ))}
    </ul>
  );
};

export default ReservationList;
