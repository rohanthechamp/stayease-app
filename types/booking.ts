import { Cabin } from "./cabin";

export type BookingStatus = "checked-in" | "checked-out" | "unconfirmed";

export type Booking = {
  id: number;
  user: number;
  guestId: number;

  created_at: string;
  startDate: string;
  endDate: string;

  numNights: number;
  numGuests: number;

  cabinPrice: string;
  extrasPrice: string | null;
  totalPrice: string;

  status: BookingStatus;
  isPaid: boolean;
  observations: string;

  // Nested cabin
  cabins: Cabin;
};
export type SelectCountryProps = {
  defaultCountry?: string;
  name: string;
  id: string;
  className?: string;
  // data: Country[],
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
};

export type Country = {
  name: string;
  code: string;
  flag: string;
};

export type Settings = {
  id: number,
  minBookingLength: number,
  maxBookingLength: number,
  minGuestsPerBooking: number,
  breakfastPrice: number,
  created_at: Date,
  hotel: number
}