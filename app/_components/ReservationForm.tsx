"use client";

import { Cabin } from "@/types/cabin";
import { useReservation } from "../_context/ReservatationContext";
import { format, differenceInDays } from "date-fns";
import { bookingDataType } from "@/types/booking";
import { useSession } from "next-auth/react";
import { handleBookingFormAction } from "../_lib/action";
// import { useActionState } from "react";
import { useFormState } from "react-dom";

import { CabinBookedDate } from "../_lib/data-service";
import { isRangeOverlapping } from "../_lib/helpers";
import ReForm from "./ReForm";

// import { useRouter } from "next/navigation";
// import { revalidatePath } from "next/cache";
const initialState = {
  success: false,
  message: "",
};

function ReservationForm({
  cabin,
  bookedDates,
}: {
  cabin: Cabin;
  bookedDates: CabinBookedDate[];
}) {
  // const router = useRouter();

  const { maxCapacity } = cabin; //

  const { range } = useReservation();
  const { data: session } = useSession();

  const nights =
    range.from && range.to ? differenceInDays(range.to, range.from) : 0;

  const guestID = session?.user.guestId

  const bookingData: bookingDataType = {
    startDate: range.from ? format(range.from, "yyyy-MM-dd") : null,
    endDate: range.to ? format(range.to, "yyyy-MM-dd") : null,
    guest: guestID,
    extrasPrice: 0,
    cabin: cabin.id,
    numNights: nights,
  };

  // 🔥 Bind server action with bookingData
  const actionWithData = handleBookingFormAction.bind(null, bookingData);
  const [state, formAction] = useFormState(actionWithData, initialState);
  // ✅   4 — prevent invalid booking
  // const isDateSelected = range.from && range.to;
  const hasConflict = isRangeOverlapping(range, bookedDates);
  const isValidRange = Boolean(range.from) && Boolean(range.to) && !hasConflict;

  return (
    <div className="scale-[1.01]">
      {/* Header */}
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        <p>
          Logged in as {session?.user?.name?.split(" ")[0] || "User"}{" "}
          {/* ✅   3 */}
        </p>

        <div className="flex gap-4 items-center">
          <img
            referrerPolicy="no-referrer"
            className="h-8 rounded-full"
            src={session?.user?.image || ""}
            alt={session?.user?.name || "User"}
          />
          <p>{session?.user?.name}</p>
        </div>
      </div>

      {/* Date Info */}
      <p className="text-4xl bg-slate-600">
        {range.from ? format(range.from, "MMM dd") : "Select date"}
        {" — "}
        {range.to ? format(range.to, "MMM dd") : ""}
        {nights > 0 && <span> ({nights} nights)</span>}
      </p>

      <ReForm
        mode="create"
        state={state}
        range={range}
        hasConflict={hasConflict}
        isValidRange={isValidRange}
        maxCapacity={maxCapacity}
        formAction={formAction}
      />

    </div>
  );
}

export default ReservationForm;
