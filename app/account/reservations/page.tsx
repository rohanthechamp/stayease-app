import { getServerSession } from "next-auth";
// import ReservationCard from "../../_components/ReservationCard";
import { BookingAPI } from "@/types/booking";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAllGuestBookings } from "@/app/_lib/data-service";
import ReservationList from "@/app/_components/ReservationList";

export default async function Page() {
  // CHANGE
  const session = await getServerSession(authOptions);
  const guestId = session?.user.guestId;
  console.log("guest id:-", guestId);

  const bookings: BookingAPI[] = await getAllGuestBookings(guestId);
  console.log('getAllGuestBookings',bookings)

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Your reservations {bookings.length}
      </h2>

      {bookings.length === 0 ? (
        <p className="text-lg">
          You have no reservations yet. Check out our{" "}
          <a className="underline text-accent-500" href="/cabins">
            luxury cabins &rarr;
          </a>
        </p>
      ) : (
        <ReservationList bookings={bookings} />
      )}
    </div>
  );
}
