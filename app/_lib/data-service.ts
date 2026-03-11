// import { Country } from "@/types/booking";
import { Country, Settings } from "@/types/booking";
import { axiosPrivate } from "./axiosClient";
import { Cabin, FilterValue, SortValue } from "@/types/cabin";

export async function getCountries(): Promise<Country[]> {
    const res = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,cca2,flags",
        { cache: "force-cache" }, // good for Next.js
    );

    if (!res.ok) throw new Error("Failed to fetch countries");

    const data = await res.json();

    const countries: Country[] = data.map((c: any) => ({
        name: c.name.common,
        code: c.cca2,
        flag: c.flags.svg,
    }));

    return countries;
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
        startDate: new Date(item.startDate),
        endDate: new Date(item.endDate),
    }));
    // console.log('formatted data',res)

    return formatted;
}

export async function getGuest(email: string) {
    try {
        const response = await axiosPrivate.get(`api/guests/`, {
            params: { email },
        });
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 404) return null;
        throw error;
    }
}

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
