import {
    Booking,
    bookingDataType,
    Country,
    formDataType,
    Settings,
} from "@/types/booking";
import axiosClient, { axiosPrivate } from "./axiosClient";

import { Cabin, FilterValue, SortValue } from "@/types/cabin";
import { format } from "date-fns";
import { getError } from "./helpers";
import { cache } from "react";

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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

export const getCabins = async (
    sortValue: SortValue = "all",
    filterValue: FilterValue = "all",
    pageValue: number = 1,
): Promise<Cabin[]> => {
    try {
        if (sortValue === "all" && filterValue === "all") {
            const { data } = await axiosClient.get("guest_portal/cabins/");
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
        const { data } = await axiosClient.get<PaginatedResponse<Cabin>>(
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
export async function getCabin(id: string): Promise<Cabin> { // <-- Return just the Type
    try {
        const response = await axiosClient.get(`guest_portal/cabins/${id}/`);
        return response.data;
    } catch (error: any) {
        
        throw new Error(getError(error) || "Failed to fetch cabin data");
    }
}

export async function getSettings(): Promise<Settings> {
    const res = await axiosClient.get("guest_portal/settings/");
    console.log("getSettings", res.data);

    const data = res.data;

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

    const res = await axiosClient.get(
        `guest_portal/cabins/${cabinId}/booked-dates/`,
    );

    const data = res.data;

    const formatted: CabinBookedDate[] = data.map((item: any) => ({
        startDate: new Date(item.startDate),
        endDate: new Date(item.endDate),
    }));


    return formatted;
}

export const getGuest = cache(async (email: string) => {
    const res = await fetch(`${BASE_URL}guest_portal/guests?email=${email}`, {
        cache: "no-store", // always fresh
    });
    console.log("getGuest", res);

    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch guest");

    return res.json();
});

type guestCredentials = {
    email: string;
    fullName?: string | null;
    password?: string | null;
    isOAuthUser: boolean;
};

type guestCreationResponse = {
    success: boolean;
    message: string;
};

export async function createGuest(
    newGuest: guestCredentials,
): Promise<guestCreationResponse> {
    try {
        const response = await axiosClient.post(`guest_portal/guests/`, {
            ...newGuest,
        });

        if (response.status === 201) {
            return {
                success: true,
                message: response.data[0] || "Guest created successfully",
            };
        }

        return { success: false, message: "Unexpected response status" };
    } catch (error: any) {
        const errMsg = getError(error);
        return { success: false, message: errMsg || "Guest creation failed" };
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
        const session = await getServerSession(authOptions);
        const { data, status } = await axiosPrivate.patch(
            `guest_portal/guest/${guestId}/`,
            updatedGuest,
            {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            },
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
        const session = await getServerSession(authOptions);
        const { data, status } = await axiosPrivate.post(
            `guest_portal/bookings/create/`,
            BookingData,

            {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            },
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
        const session = await getServerSession(authOptions);
        const { data } = await axiosPrivate.get(
            `guest_portal/guest/bookings/${guestId}/`,
            {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            },
        );
        console.log("getAllGuestBookings", data);

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
    const session = await getServerSession(authOptions);
    const response = await axiosPrivate.get(
        `guest_portal/bookings/${bookingId}/minimal/`,
        {
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
        },
    );
    console.log('getBookingData', response.data)

    const impData = {
        observations: response.data.observations,
        numGuests: response.data.numGuests,
        maxCapacity: response.data.cabin__maxCapacity,
    };

    return impData;
}


export type ApiResponseBookingData1 = {
    observations: string;
    numGuests: number;

};

export async function updateBooking(
    bookingId: number,
    UpdateBookingData: ApiResponseBookingData1,
): Promise<ApiResponse> {

    try {
        const session = await getServerSession(authOptions);
        const { data, status } = await axiosPrivate.patch(
            `guest_portal/bookings/${bookingId}/`,
            UpdateBookingData,
            {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }
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

export type ApiResponseDelete =
    | { success: true }
    | { success: false; message: string };
export async function deleteBooking(
    id: number,
    
): Promise<ApiResponseDelete> {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session || !session.user?.guestId) {
            throw new Error("You must be logged in to perform this action");
        }


        const guestId = session.user.guestId;

        const response = await axiosPrivate.delete(`guest_portal/bookings/${id}/`, {
            params: {
                guestId: guestId,
            },
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
            },
        });

        if (response.status === 404) {
            return {
                success: true,
            };
        }

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

export async function getJwtTokens(email: string) {
    // Changed method to POST because GET requests cannot have a body
    const url = `${BASE_URL}guest_portal/auth/google/`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
        }),
    });
    console.log("getJwtTokens", response);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch JWT tokens");
    }

    const jwtData = await response.json();
    return jwtData;
}
