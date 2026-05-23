"use client";

import { Settings } from "@/types/booking";
import { Cabin } from "@/types/cabin";
import { CabinBookedDate } from "../_lib/data-service";

import { DayPicker, DateRange } from "react-day-picker";
import { differenceInDays } from "date-fns";
import { useMemo } from "react";

import { useReservation } from "../_context/ReservatationContext";

import "react-day-picker/dist/style.css";

type Props = {
  settings: Settings;
  bookedDates: CabinBookedDate[];
  cabin: Cabin;
};

function DateSelector({ settings, bookedDates, cabin }: Props) {
  const { range, setRange, resetRange } = useReservation();

  const today = new Date();

  const { regularPrice, discount } = cabin;
  const { minBookingLength, maxBookingLength } = settings;

  /*
  =========================
  Calculate Nights
  =========================
  */
  const numNights = useMemo(() => {
    if (!range?.from || !range?.to) return 0;
    return differenceInDays(range.to, range.from);
  }, [range]);

  /*
  =========================
  Price Logic
  =========================
  */
  const pricePerNight =
    discount > 0 ? regularPrice - discount : regularPrice;
  const totalPrice = numNights * pricePerNight;

  /*
  =========================
  Disabled Dates (SAFE)
  =========================
  */
  const disabledDays = useMemo(() => {
    return bookedDates.map((date) => ({
      from: new Date(date.startDate),
      to: new Date(date.endDate),
    }));
  }, [bookedDates]);

  /*
  =========================
  Booking Validation (FIXED)
  =========================
  */
  function isAlreadyBooked(range: DateRange) {
    if (!range?.from || !range?.to) return false;

    return bookedDates.some((booking) => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);

      // Proper overlap check
      return range.from <= end && range.to >= start;
    });
  }

  /*
  =========================
  Handle Select (FIXED)
  =========================
  */
  function handleSelect(selected: DateRange | undefined) {
    if (!selected) return;

    // Allow first click (partial selection)
    if (!selected.from || !selected.to) {
      setRange(selected);
      return;
    }

    // Prevent overlapping bookings
    if (isAlreadyBooked(selected)) {
      resetRange();
      return;
    }

    setRange(selected);
  }

  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="pt-12 place-self-center"
        mode="range"
        selected={range}
        onSelect={handleSelect}
        min={minBookingLength + 1}
        max={maxBookingLength}
        fromMonth={today}
        fromDate={today}
        toYear={today.getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={2}
        disabled={disabledDays}
        modifiersStyles={{
          disabled: { color: "red", fontWeight: "bold" },
        }}
      />

      <div className="flex items-center justify-between px-8 bg-accent-700 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">
                  ${pricePerNight.toFixed(2)}
                </span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span>/night</span>
          </p>

          {numNights > 0 && (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                × {numNights}
              </p>

              <p>
                <span className="text-lg font-bold uppercase">
                  Total
                </span>{" "}
                <span className="text-2xl font-semibold">
                  ${totalPrice.toFixed(2)}
                </span>
              </p>
            </>
          )}
        </div>

        {(range?.from || range?.to) && (
          <button
            onClick={resetRange}
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default DateSelector;