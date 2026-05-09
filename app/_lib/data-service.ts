// import { Country } from "@/types/booking";
import {
    Booking,
    BookingAPI,
    bookingDataType,
    Country,
    formDataType,
    Settings,
} from "@/types/booking";
import { axiosPrivate } from "./axiosClient";
import { Cabin, FilterValue, SortValue } from "@/types/cabin";
import { format } from "date-fns";
import { BASE_URL, getError } from "./helpers";

import { AxiosError } from "axios";
import { cache } from "react";
import { revalidatePath } from "next/cache";
export async function getCountries(): Promise<Country[]> {
    const res = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,cca2,flags",
        { cache: "force-cache" },
    );

    if (!res.ok) throw new Error("Failed to fetch countries");

    const data = await res.json();

    const countries: Country[] = data.map((c: any) => ({
        name: c.name.common,
        code: c.cca2,
        flag: c.flags.svg,
    }));

    return countries.sort().reverse();
}
// type Country = {
//   name: string;
//   code: string;
// };

// export  function getCountries(): Promise<Country[]> {
//   return [
//     { name: "India", code: "IN" },
//     { name: "United States", code: "US" },
//     { name: "United Kingdom", code: "GB" },
//     { name: "Canada", code: "CA" },
//     { name: "Australia", code: "AU" },
//     { name: "Germany", code: "DE" },
//     { name: "France", code: "FR" },
//     { name: "Italy", code: "IT" },
//     { name: "Japan", code: "JP" },
//     { name: "Brazil", code: "BR" },
//   ];
// }
type Params = {
    discount?: string;
    ordering?: string;
    pagenumber?: number;
};
type PaginatedResponse<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
};
// type SingleCabinResponse<T> = {
//     data: T;
// };

export const getCabins = async (
    sortValue: SortValue = "all",
    filterValue: FilterValue = "all",
    pageValue: number = 1,
): Promise<Cabin[]> => {
    try {
        if (sortValue === "all" && filterValue === "all") {
            const { data } = await axiosPrivate.get("api/cabins/");
            return data?.results || [];
        }
        const params: Params = {};

        if (filterValue && filterValue !== "all") {
            params.discount = filterValue;
        }

        if (sortValue && sortValue !== "all") {
            const ascOrder = ["asc", "min", "low"];
            const [field, direction] = sortValue.split("-");
            const fieldMapping: Record<string, string> = {
                name: "name",
                regularPrice: "regularPrice",
                maxCapacityCabins: "maxCapacity",
                minCapacityCabins: "maxCapacity", // if you actually have a minCapacity field, map that instead
            };

            const mappedField = fieldMapping[field];
            if (!mappedField) throw new Error("Invalid sorting field from UI");

            params.ordering = ascOrder.includes(direction)
                ? mappedField
                : `-${mappedField}`;
        }
        if (pageValue && pageValue > 0) {
            params.pagenumber = pageValue;
        }
        const { data } = await axiosPrivate.get<PaginatedResponse<Cabin>>(
            "api/cabins/",
            { params },
        );

        const allCAbins = data?.results.map((cabin) => {
            return {
                ...cabin,
                created_at: new Date(cabin.created_at),
                regularPrice: Number(cabin.regularPrice),
                discount: Number(cabin.discount),
            };
        });

        // console.log('ALL CAbins', allCAbins)
        return allCAbins;
    } catch (error) {
        console.error("Error fetching cabins:", error);
        throw error; // rethrow so react-query sets error state
    }
};

// SINGLE cabin
export async function getCabin(id: string): Promise<Cabin> {
    // console.log('Entered in Get Cabin Function', id, typeof id);

    const response = await axiosPrivate.get(`api/cabins/${id}/`);
    // console.log('getCabin RESULTS -', response)
    // console.log(response ? /'yes' : 'no');
    return response.data;
}

export async function getSettings(): Promise<Settings> {
    const res = await axiosPrivate.get("api/settings/");

    const data = res.data[0];

    const settingsData: Settings = {
        id: data.id,
        minBookingLength: data.minBookingLength,
        maxBookingLength: data.maxBookingLength,
        minGuestsPerBooking: data.minGuestsPerBooking,
        breakfastPrice: Number(data.breakfastPrice), // convert string → number
        created_at: new Date(data.created_at), // convert string → Date
        hotel: data.hotel,
    };

    return settingsData;
}
export type CabinBookedDate = {
    startDate: Date;
    endDate: Date;
};

export async function getCabinBookedDates(
    cabinId: number,
): Promise<CabinBookedDate[]> {
    // console.log('cabin id',cabinId)

    const res = await axiosPrivate.get(`/api/cabins/${cabinId}/booked-dates/`);

    const data = res.data;

    const formatted: CabinBookedDate[] = data.map((item: any) => ({
        startDate: format(new Date(item.startDate), "yyyy M d"),
        endDate: format(new Date(item.endDate), "yyyy M d"),
    }));
    // console.log('formatted data',res)

    return formatted;
}

export const getGuest = cache(async (email: string) => {
    const res = await fetch(`${BASE_URL}/api/guests?email=${email}`, {
        cache: "no-store", // always fresh
    });

    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch guest");

    return res.json();
});

export async function createGuest(newGuest: {
    email: string;
    fullName: string;
}) {
    try {
        const response = await axiosPrivate.post(`api/guests/`, {
            email: newGuest.email,
            fullName: newGuest.fullName,
        });
        return response.data;
    } catch (error: any) {
        console.error("Error creating guest:", error.response?.data);
        throw new Error("Guest creation failed");
    }
}
export async function updateGuest(
    guestId: number,
    updatedGuest: {
        nationality?: string;
        nationalID?: number;
        countryFlag?: string;
    },
) {
    try {
        const { data, status } = await axiosPrivate.patch(
            `api/guests/${guestId}/`,
            updatedGuest,
        );
        console.log("updateGuest data", data);

        return {
            data,
            status,
        };
    } catch (error: any) {
        console.error("Guest update error:", error.response?.data);
        throw new Error("Failed to update guest");
    }
}

type ApiResponse<T = any> =
    | { success: true; status: number; data: T }
    | { success: false; status: number; message: string };

export async function createBooking(
    bookingData: bookingDataType,
    formData: formDataType,
): Promise<ApiResponse> {
    const BookingData = { ...bookingData, ...formData };
    console.log("BookingData :- ", BookingData);
    try {
        const { data, status } = await axiosPrivate.post(
            `api/bookings/`,
            BookingData,
        );
        console.log("Success ☺️☺️☺️", data, status);
        return { success: true, status, data };
    } catch (error: any) {
        console.log("Failed 🚨🚨🚨🚨", error);

        const errorMsg = getError(error);

        return {
            success: false,
            status: error?.response?.status,
            message: errorMsg,
        };
    }
}

export async function getAllGuestBookings(guestId: number): Promise<Booking[]> {
    try {
        const { data } = await axiosPrivate.get(`/api/guests/${guestId}/bookings/`);

        return (data || []).map((item: any) => ({
            id: item.id,
            guest: item.guest_id,
            startDate: item.startDate,
            endDate: item.endDate,
            numNights: item.numNights,
            totalPrice: item.totalPrice,
            numGuests: item.numGuests,
            status: item.status,
            created_at: item.created_at,
            cabin: {
                name: item.cabin__name,
                image: item.cabin__image,
            },
        }));
    } catch (error: any) {
        throw new Error(
            error?.response?.data?.detail || "Failed to fetch all bookings",
        );
    }
}

export type ApiResponseBookingData = {
    observations: string;
    numGuests: number;
    maxCapacity: number;
};
export async function getBookingData(
    bookingId: number,
): Promise<ApiResponseBookingData> {
    if (!bookingId) {
        throw new Error("Invalid bookingId");
    }
    const { data } = await axiosPrivate.get(`api/bookings/${bookingId}/minimal/`);

    const impData = {
        observations: data.observations,
        numGuests: data.numGuests,
        maxCapacity: data.cabin__maxCapacity,
    };

    return impData;
}

export async function updateBooking(
    bookingId: number,
    UpdateBookingData: ApiResponseBookingData,
): Promise<ApiResponse> {
    console.log("UpdateBookingData :- ", UpdateBookingData);
    try {
        const { data, status } = await axiosPrivate.patch(
            `api/bookings/${bookingId}/`,
            UpdateBookingData,
        );
        console.log("Success ☺️☺️☺️", data, status);
        return { success: true, status, data };
    } catch (error: any) {
        console.log("Failed 🚨🚨🚨🚨", error);
        const errorMsg = getError(error);
        return {
            success: false,
            status: error?.response?.status,
            message: errorMsg,
        };
    }
}

type ApiResponseDelete =
    | { success: true }
    | { success: false; message: string };
export async function deleteBooking(
    id: number,
    guestId: number,
): Promise<ApiResponseDelete> {
    try {
        // throw new Error('something went wrong ')

        await axiosPrivate.delete(`/api/bookings/${id}/`, {
            params: {
                guestId: guestId,
            },
        });
        return {
            success: true,
        };
    } catch (error: any) {
        const message =
            error?.response?.data?.detail ||
            error?.response?.data?.message ||
            error?.response?.statusText ||
            "Something went wrong";

        return {
            success: false,
            message,
        };
    }
}
