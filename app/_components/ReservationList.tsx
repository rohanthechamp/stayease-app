"use client";

import React, { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ReservationCard from "./ReservationCard";
import { handleBookingDeleteFormAction } from "../_lib/action";
import { BookingAPI } from "@/types/booking";

const ReservationList = ({ bookings }: { bookings: BookingAPI[] }) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [optimisticBookings, removeOptimisticBooking] = useOptimistic(
    bookings,
    (state, bookingId: number) =>
      state.filter((booking) => booking.id !== bookingId)
  );

  async function handleDelete(bookingId: number) {
    setError(null);

    // update UI immediately
    startTransition(() => {
      removeOptimisticBooking(bookingId);
    });

    try {
      const response = await handleBookingDeleteFormAction(bookingId);

      if (!response.success) {
        throw new Error(response.message || "Failed to delete booking");
      }

      // re-fetch server state
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Delete failed");
      router.refresh(); // rollback UI from real server data
    }
  }

  return (
    <>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <ul className="space-y-6">
        {optimisticBookings.map((booking) => (
          <ReservationCard
            key={booking.id}
            booking={booking}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </>
  );
};

export default ReservationList;














// "use client";
// import { BookingAPI } from "@/types/booking";
// import React, { useOptimistic, useState } from "react";
// import ReservationCard from "./ReservationCard";
// import { handleBookingDeleteFormAction } from "../_lib/action";

// const ReservationList = ({ bookings }: { bookings: BookingAPI[] }) => {
//   const [error, setError] = useState<string | null | undefined>(null)

//   const [optimisticBookings, optimisticDelete] = useOptimistic(
//     bookings,
//     (state, bookingId) => {
//       return state.filter((data) => data.id !== bookingId);
//     },
//   );

//   async function handleDelete(bookingId: number) {
//     optimisticDelete(bookingId);

//     const response = await handleBookingDeleteFormAction(bookingId);

//     setError(response.message)
//   }

//   return (
//     <ul className="space-y-6">
//       {optimisticBookings.map((booking) => (
//         <ReservationCard
//           booking={booking}
//           key={booking.id}
//           onDelete={handleDelete}
//           errorMsg={error}
//         />
//       ))}
//     </ul>
//   );
// };

// export default ReservationList;


