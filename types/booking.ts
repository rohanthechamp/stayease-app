import { Cabin } from "./cabin";

export type BookingStatus = "checked-in" | "checked-out" | "unconfirmed";

export type Booking = {
  id: number;
  user: number| null;
  guest: number;

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
export type GuestBookings = {
  id: number;

  guest_id: number;

  created_at: string;
  startDate: string;
  endDate: string;

  numNights: number;
  numGuests: number;

  totalPrice: string;

  status: BookingStatus;

  cabin_name: string;
  cabin_image: string | null;
};
export type SelectCountryProps = {
  defaultCountry?: string;
  name: string;
  id: string;
  className?: string;
  data: Country[],
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


export type bookingDataType = {
  user?: number;
  startDate: Date | string | null;
  endDate: Date | string | null;
  cabinPrice?: number;
  extrasPrice?: number;
  totalPrice?: number;
  status?: BookingStatus;
  isPaid?: boolean;
  guest: number | undefined;
  cabin: number;
  numNights: number;

};

export type formDataType = {
  numGuests: number;
  created_at: Date | string;
  observations?: string;
};

 
export type BookingAPI = {
  id: number;
  guest: number;
  startDate: string;
  endDate: string;
  numNights: number;
  totalPrice: number;
  numGuests: number;
  status: string;
  created_at: string;
  cabin: {
    name: string;
    image: string;
  };
};