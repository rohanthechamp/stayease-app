"use client";

import { Settings } from "@/types/booking";
import { Cabin } from "@/types/cabin";
import { CabinBookedDate } from "../_lib/data-service";

import { DayPicker, DateRange } from "react-day-picker";
import {
  differenceInDays,
  isPast,
  isSameDay,
  isWithinInterval,
} from "date-fns";
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
  const pricePerNight = discount > 0 ? regularPrice - discount : regularPrice;

  const totalPrice = numNights * pricePerNight;

  /*
  =========================
  Disabled Dates
  =========================
  */
  const disabledDays = useMemo(() => {
    return bookedDates.map((date) => ({
      from: new Date(date.startDate.replace(/ /g, "-")),
      to: new Date(date.endDate.replace(/ /g, "-")),
    }));
  }, [bookedDates]);

  /*
  =========================
  Booking Validation
  =========================
  */
  function isAlreadyBooked(range: DateRange) {
    if (!range?.from || !range?.to) return false;

    return bookedDates.some((booking) => {
      const start = new Date(booking.startDate.replace(/ /g, "-"));
      const end = new Date(booking.endDate.replace(/ /g, "-"));

      return isWithinInterval(range.from!, { start, end }) ||
        isWithinInterval(range.to!, { start, end });
    });
  }

  /*
  =========================
  Handle Select
  =========================
  */
  function handleSelect(selected: DateRange | undefined) {
    if (!selected) return;

    if (isAlreadyBooked(selected)) {
      resetRange();
      return;
    }

    setRange(selected);
  }

  return (
    <div className="flex flex-col justify-between">
      {/* 
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        disabled={disabledDays}
        min={minBookingLength + 1}
        max={maxBookingLength}
        fromMonth={today}
        fromDate={today}
        toYear={today.getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={2}
        className="pt-12 place-self-center"
        modifiersStyles={{
          disabled: { color: "red", fontWeight: "bold" },
        }}
      /> */}

      <DayPicker
        className="pt-12 place-self-center"
        mode="range"
        onSelect={handleSelect}
        selected={range}
        min={minBookingLength + 1}
        max={maxBookingLength}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={2}
        disabled={disabledDays}
        className="pt-12 place-self-center"
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
// "use client";
// import { Settings } from "@/types/booking";
// import { isWithinInterval } from "date-fns";
// import { DayPicker } from "react-day-picker";
// import { format, differenceInDays } from "date-fns";

// import "react-day-picker/dist/style.css";
// import { CabinBookedDate } from "../_lib/data-service";
// import { Cabin } from "@/types/cabin";
// import { useReservation } from "../_context/ReservatationContext";
// function isAlreadyBooked(range, datesArr) {
//   return (
//     range.from &&
//     range.to &&
//     datesArr.some((date) =>
//       isWithinInterval(date, { start: range.from, end: range.to }),
//     )
//   );
// }

// type Props = {
//   settings: Settings;
//   bookedDates: CabinBookedDate[];
//   cabin: Cabin;
// };

// function DateSelector({ settings, bookedDates, cabin }: Props) {
//   const { range, setRange, resetRange } = useReservation();
//   // CHANGE
//   const { regularPrice, discount } = cabin;
//   const numNights =
//     range.from && range.to ? differenceInDays(range.to, range.from) : 0;
//   const cabinPrice = regularPrice;
//   // SETTINGS
//   const { minBookingLength, maxBookingLength } = settings;
//   console.log("bookedDates", bookedDates);

//   const disabledDays = bookedDates.map((range) => ({
//     from: new Date(range.startDate.replace(/ /g, "-")),
//     to: new Date(range.endDate.replace(/ /g, "-")),
//   }));
//   console.log("AlreadybookedDates", disabledDays);
//   return (
//     <div className="flex flex-col justify-between">
//       <DayPicker
//         disabled={disabledDays}
//         className="pt-12 place-self-center"
//         mode="range"
//         onSelect={(range) => setRange(range)}
//         selected={range}
//         min={minBookingLength + 1}
//         max={maxBookingLength}
//         fromMonth={new Date()}
//         fromDate={new Date()}
//         toYear={new Date().getFullYear() + 5}
//         captionLayout="dropdown"
//         numberOfMonths={2}
//         modifiersStyles={{ disabled: { color: "red", fontWeight: "bolder" } }}
//       />

//       <div className="flex items-center justify-between px-8 bg-accent-700 text-primary-800 h-[72px]">
//         <div className="flex items-baseline gap-6">
//           <p className="flex gap-2 items-baseline">
//             {discount > 0 ? (
//               <>
//                 <span className="text-2xl">
//                   {" "}
//                   ${(regularPrice - discount).toFixed(2)}
//                 </span>
//                 <span className="line-through font-semibold text-primary-700">
//                   ${regularPrice}
//                 </span>
//               </>
//             ) : (
//               <span className="text-2xl">${regularPrice}</span>
//             )}
//             <span className="">/night</span>
//           </p>
//           {numNights ? (
//             <>
//               <p className="bg-accent-600 px-3 py-2 text-2xl">
//                 <span>&times;</span> <span>{numNights}</span>
//               </p>
//               <p>
//                 <span className="text-lg font-bold uppercase">Total</span>{" "}
//                 <span className="text-2xl font-semibold">{(numNights * cabinPrice).toFixed(2)}</span>
//               </p>
//             </>
//           ) : null}
//         </div>

//         {range.from || range.to ? (
//           <button
//             className="border border-primary-800 py-2 px-4 text-sm font-semibold"
//             onClick={() => resetRange()}
//           >
//             Clear
//           </button>
//         ) : null}
//       </div>
//     </div>
//   );
// }

// export default DateSelector;
