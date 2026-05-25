"use client";

import { Cabin } from "@/types/cabin";
import { useReservation } from "../_context/ReservatationContext";
import { format, differenceInDays } from "date-fns";
import { bookingDataType } from "@/types/booking";
import { useSession } from "next-auth/react";
import { handleBookingFormAction } from "../_lib/action";
import { useFormState } from "react-dom";
import { CabinBookedDate } from "../_lib/data-service";
import { isRangeOverlapping } from "../_lib/helpers";
import ReForm from "./ReForm";
import Link from "next/link";
import {
  ArrowRightIcon,
  LockClosedIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";

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
  const { maxCapacity } = cabin;
  const { range } = useReservation();
  const { data: session } = useSession();

  const isSignedIn = Boolean(session?.accessToken);
  const guestID = session?.user.guestId ;

  const nights =
    range.from && range.to ? differenceInDays(range.to, range.from) : 0;

  const bookingData: bookingDataType = {
    startDate: range.from ? format(range.from, "yyyy-MM-dd") : null,
    endDate: range.to ? format(range.to, "yyyy-MM-dd") : null,
    guest: guestID,
    extrasPrice: 0,
    cabin: cabin.id,
    numNights: nights,
  };

  const actionWithData = handleBookingFormAction.bind(null, bookingData);
  const [state, formAction] = useFormState(actionWithData, initialState);

  const hasConflict = isRangeOverlapping(range, bookedDates);
  const isValidRange =
    Boolean(range.from) && Boolean(range.to) && !hasConflict;

  return (
    <section className="overflow-hidden rounded-3xl border border-primary-800 bg-primary-900/80 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="border-b border-primary-800 px-8 py-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-400/80">
              Reserve your stay
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-primary-100">
              Complete your booking
            </h3>
          </div>

          {isSignedIn ? (
            <div className="flex items-center gap-3 rounded-2xl border border-primary-700 bg-primary-800/70 px-4 py-2">
              <img
                referrerPolicy="no-referrer"
                className="h-10 w-10 rounded-full border border-accent-500/30 object-cover"
                src={session?.user?.image || ""}
                alt={session?.user?.name || "Guest"}
              />
              <div className="leading-tight">
                <p className="text-sm text-primary-300">Signed in as</p>
                <p className="font-medium text-primary-100">
                  {session?.user?.name?.split(" ")[0] || "Guest"}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl border border-primary-700 bg-primary-800/70 px-4 py-2 text-primary-200">
              <UserCircleIcon className="h-10 w-10 text-accent-400" />
              <div className="leading-tight">
                <p className="text-sm text-primary-400">Guest access</p>
                <p className="font-medium text-primary-100">Sign in required</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-8 px-8 py-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-primary-800 bg-primary-950/40 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-400">
              Selected dates
            </p>
            <p className="mt-2 text-2xl font-medium text-primary-100">
              {range.from ? format(range.from, "MMM dd") : "Select a check-in date"}
              {" — "}
              {range.to ? format(range.to, "MMM dd") : "Select a check-out date"}
            </p>
            {nights > 0 && (
              <p className="mt-2 text-sm text-primary-300">
                {nights} night{nights > 1 ? "s" : ""}
              </p>
            )}
          </div>

          {!isSignedIn ? (
            <div className="rounded-2xl border border-accent-500/20 bg-accent-500/10 px-5 py-5">
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-full bg-accent-500/15 p-3 text-accent-400">
                  <LockClosedIcon className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-primary-100">
                    Sign in to book your stay
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-primary-300">
                    You can browse cabins freely, but booking requires a guest account.
                    Sign in with Google to reserve this cabin and manage your trip.
                  </p>

                  <Link
                    href="/signin"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-600"
                  >
                    Sign in now
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-primary-800 bg-primary-950/40 px-5 py-5">
              <p className="text-sm leading-6 text-primary-300">
                Choose your dates carefully. If the selected range overlaps with an
                existing booking, the selection will be cleared automatically.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-primary-800 bg-primary-950/40 p-5">
          {isSignedIn ? (
            <ReForm
              mode="create"
              state={state}
              range={range}
              hasConflict={hasConflict}
              isValidRange={isValidRange}
              maxCapacity={maxCapacity}
              formAction={formAction}
            />
          ) : (
            <div className="flex h-full min-h-[280px] flex-col justify-center rounded-2xl border border-dashed border-primary-700 bg-primary-900/60 px-6 py-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-500/15 text-accent-400">
                <LockClosedIcon className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-xl font-semibold text-primary-100">
                Booking locked
              </h4>
              <p className="mt-3 text-sm leading-6 text-primary-300">
                Sign in first to unlock the reservation form and complete your booking.
              </p>
              <Link
                href="/signin"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-600"
              >
                Go to sign in
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ReservationForm;