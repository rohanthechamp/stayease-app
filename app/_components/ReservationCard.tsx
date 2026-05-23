// import { PencilSquareIcon } from "@heroicons/react/24/solid";
// import { format, formatDistance, isPast, isToday, parseISO } from "date-fns";
// import DeleteReservation from "./DeleteReservation";
// import { Booking, GuestBookings } from "@/types/booking";
// import Image from "next/image";
// import default_cabin from "@/public/hotel-cabin.jpg";
// import { ApiResponseDelete } from "../_lib/data-service";

// export const formatDistanceFromNow = (dateStr: string) =>
//   formatDistance(parseISO(dateStr), new Date(), {
//     addSuffix: true,
//   }).replace("about ", "");

// type Props = {
//   booking: GuestBookings;
//   onDelete: (bookingId: number) => Promise<ApiResponseDelete>;

// };
// function ReservationCard({ booking, onDelete }: Props) {
//   const {
//     id,
//     guest_id,
//     startDate,
//     endDate,
//     numNights,
//     totalPrice,
//     numGuests,
//     status,
//     created_at,
//     cabin_name,
//     cabin_image,
//   } = booking;

//   return (
//     <div className="flex border border-primary-800 rounded-lg">
//       <div className="relative h-32 aspect-square">
//         <Image
//           src={cabin_image || default_cabin}
//           alt={`Cabin ${name}`}
//           className="object-cover border-r border-primary-800"
//           fill
//         />
//       </div>

//       <div className="flex-grow px-6 py-3 flex flex-col">
//         <div className="flex items-center justify-between">
//           <h3 className="text-xl font-semibold">Booking id-{id}</h3>
//           <h3 className="text-xl font-semibold">
//             {numNights} nights in Cabin {cabin_name}
//           </h3>
//           {isPast(new Date(startDate)) ? (
//             <span className="bg-yellow-800 text-yellow-200 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
//               past
//             </span>
//           ) : (
//             <span className="bg-green-800 text-green-200 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
//               upcoming
//             </span>
//           )}
//         </div>

//         <p className="text-lg text-primary-300">
//           {format(new Date(startDate), "EEE, MMM dd yyyy")} (
//           {isToday(new Date(startDate))
//             ? "Today"
//             : formatDistanceFromNow(startDate)}
//           ) &mdash; {format(new Date(endDate), "EEE, MMM dd yyyy")}
//         </p>

//         <div className="flex gap-5 mt-auto items-baseline">
//           <p className="text-xl font-semibold text-accent-400">${totalPrice}</p>
//           <p className="text-primary-300">&bull;</p>
//           <p className="text-lg text-primary-300">
//             {numGuests} guest{numGuests > 1 && "s"}
//           </p>
//           <p className="ml-auto text-sm text-primary-400">
//             Booked {format(new Date(created_at), "EEE, MMM dd yyyy, p")}
//           </p>
//         </div>
//       </div>

//       {!isPast(new Date(startDate)) ? (
//         <div className="flex flex-col border-l border-primary-800 w-[100px]">
//           <a
//             href={`/account/reservations/edit/${id}`}
//             className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 border-b border-primary-800 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900"
//           >
//             <PencilSquareIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
//             <span className="mt-1">Edit</span>
//           </a>
//           <DeleteReservation bookingId={id} onDelete={onDelete} />


//         </div>
//       ) : null}
//     </div>
//   );
// }

// export default ReservationCard;
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { format, formatDistance, isPast, isToday, parseISO } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import default_cabin from "@/public/hotel-cabin.jpg";
import DeleteReservation from "./DeleteReservation";
import { GuestBookings } from "@/types/booking";
import { ApiResponseDelete } from "../_lib/data-service";

export const formatDistanceFromNow = (dateStr: string) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  }).replace("about ", "");

type Props = {
  booking: GuestBookings;
  onDelete: (bookingId: number) => Promise<ApiResponseDelete>;
};

function ReservationCard({ booking, onDelete }: Props) {
  const {
    id,
    startDate,
    endDate,
    numNights,
    totalPrice,
    numGuests,
    cabin_name,
    cabin_image,
    created_at,
  } = booking;

  const isPastBooking = isPast(new Date(startDate));

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-primary-900/50 shadow-lg backdrop-blur-xl transition hover:border-white/20 hover:bg-primary-900/70">
      <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr_auto]">
        {/* Image */}
        <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-full">
          <Image
            src={cabin_image || default_cabin}
            alt={`Cabin ${cabin_name}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 256px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-col gap-4 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.2em] text-primary-400">
                Booking #{id}
              </p>
              <h3 className="mt-1 truncate text-xl font-semibold text-primary-50">
                {numNights} nights in {cabin_name}
              </h3>
            </div>

            <span
              className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${isPastBooking
                  ? "bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/20"
                  : "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20"
                }`}
            >
              {isPastBooking ? "Past" : "Upcoming"}
            </span>
          </div>

          <p className="text-sm leading-6 text-primary-300 sm:text-base">
            {format(new Date(startDate), "EEE, MMM dd yyyy")} (
            {isToday(new Date(startDate))
              ? "Today"
              : formatDistanceFromNow(startDate)}
            ) &mdash; {format(new Date(endDate), "EEE, MMM dd yyyy")}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-primary-300">
            <p className="font-semibold text-accent-400">${totalPrice}</p>
            <span className="text-primary-600">•</span>
            <p>
              {numGuests} guest{numGuests > 1 ? "s" : ""}
            </p>
            <span className="text-primary-600">•</span>
            <p>Booked {format(new Date(created_at), "EEE, MMM dd yyyy, p")}</p>
          </div>
        </div>

        {/* Actions */}
        {!isPastBooking ? (
          <div className="flex flex-row border-t border-white/10 lg:flex-col lg:border-t-0 lg:border-l">
            <Link
              href={`/account/reservations/edit/${id}`}
              className="group flex flex-1 items-center justify-center gap-2 border-r border-white/10 px-4 py-4 text-xs font-semibold uppercase tracking-wide text-primary-300 transition hover:bg-accent-500 hover:text-primary-950 lg:border-r-0 lg:border-b lg:px-5"
            >
              <PencilSquareIcon className="h-5 w-5 text-primary-500 transition group-hover:text-primary-950" />
              <span>Edit</span>
            </Link>

            <DeleteReservation bookingId={id} onDelete={onDelete} />
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default ReservationCard;