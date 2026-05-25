import { AppDateRange } from "../_context/ReservatationContext";
import axiosClient from "./axiosClient";
import { CabinBookedDate } from "./data-service";

// 1. Keep this helper to strip hours/minutes for clean day-by-day comparisons
function normalizeDate(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isRangeOverlapping(
    selectedRange: AppDateRange,
    bookedDates: CabinBookedDate[],
) {
    if (!selectedRange?.from || !selectedRange?.to) return false;

    const selectedStart = normalizeDate(selectedRange.from);
    const selectedEnd = normalizeDate(selectedRange.to);

    return bookedDates.some((b) => {
        // 2. Swapped parseDate out for normalizeDate
        const bookedStart = normalizeDate(b.startDate);
        const bookedEnd = normalizeDate(b.endDate);

        return selectedStart <= bookedEnd && selectedEnd >= bookedStart;
    });
}

type BookingFormValues =
    {
        numGuests: number;
        observations?: string;
    }


type ValidationResult =
    | { success: true; data: BookingFormValues }
    | { success: false; message: string };

export function validateBookingForm(formData: FormData): ValidationResult {
    const formObject = Object.fromEntries(formData.entries()) as Record<
        string,
        string
    >;

    const numGuests = Number(formObject.numGuests);
    const observations = formObject.observations?.trim() ;

    // validation.
    if (!numGuests || numGuests <= 0) {
        return {
            success: false,
            message: "Guests must be more than 0",
        };
    }

    if (observations && observations.length > 500) {
        return {
            success: false,
            message: "Observations too long",
        };
    }


    return {
        success: true,
        data: {
            numGuests,
            observations    ,
        },
    };
}
export const getError = (error: any): string => {
    const defaultMsg = "Something went wrong ";

    if (error?.response?.data) {
        const data = error.response.data;

        if (typeof data === "string") return data;

        if (data?.detail) return data.detail;

        const firstKey = Object.keys(data)[0];

        if (firstKey) {
            return Array.isArray(data[firstKey])
                ? data[firstKey][0]
                : String(data[firstKey]);
        }
    }

    return defaultMsg;
};

export async function refreshAccessToken(token: any) {
    try {
        const response = await axiosClient.post("guest_portal/auth/refresh/", {
            refreshToken: token.refreshToken,
        });

        return {
            ...token,

            accessToken: response.data.data.accessToken,

            refreshToken: response.data.data.refreshToken,
            accessTokenExpires: Date.now() + 15 * 60 * 1000,

            error: null,
        };
    } catch (error) {
        console.log("REFRESH TOKEN ERROR", error);

        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}
