"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { createBooking, deleteBooking, updateBooking, updateGuest } from "./data-service";
import { redirect } from "next/navigation";
import { bookingDataType } from "@/types/booking";
import { validateBookingForm } from "./helpers";
import { authOptions } from "./auth";

export const handleFormAction = async (formData: FormData) => {
    const session = await getServerSession(authOptions);
    const guestId = session?.user?.guestId;

    if (!guestId) {
        throw new Error("User not authenticated");
    }

    const nationality = formData.get("nationality")?.toString().split("%")[0];
    const nationalIDRaw = formData.get("nationalID")?.toString();
    const nationalID = nationalIDRaw ? Number(nationalIDRaw) : undefined;
    const countryFlag = formData.get("logo")?.toString();
    console.log(nationality, nationalID, countryFlag);
    const { status } = await updateGuest(guestId, {
        nationality,
        nationalID,
        countryFlag,
    });

    if (status === 200) {
        revalidatePath("/account");
        redirect("/account/profile");
    }

    throw new Error("Failed to update profile");
};

type ActionState = {
    success: boolean;
    message?: string;
};

export const handleBookingFormAction = async (
    bookingData: bookingDataType,
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> => {
    const result = validateBookingForm(formData);

    if (!result.success) {
        return { success: false, message: result.message };
    }

    const { numGuests, observations } = result.data;


    const created_at = new Date().toISOString().split("T")[0];

    const cleanedFormData = {
        numGuests,
        observations,
        created_at,
    };
    console.log(bookingData,cleanedFormData)

    // ✅ API call
    const response = await createBooking(bookingData, cleanedFormData);

    if (!response.success) {
        return { success: false, message: response.message };
    }
    revalidatePath('/account/reservations');
    redirect('/cabins/thankyou');

};








export const handleBookingUpdateFormAction = async (
    bookingId: number,
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> => {
    const result = validateBookingForm(formData);

    if (!result.success) {
        return { success: false, message: result.message };
    }
    const { numGuests, observations } = result.data;

    const cleanedFormData = {
        observations,
        numGuests,
    };
    console.log(cleanedFormData)

    // ✅ API call

    const response = await updateBooking(bookingId, cleanedFormData)
    // const response = { success: true, message: '' }
    if (!response.success) {
        return { success: false, message: response.message };
    }
    revalidatePath('/account/reservations');

    redirect('/account/reservations');

};


export const handleBookingDeleteFormAction = async (
    bookingId: number,
): Promise<ActionState> => {
    const session = await getServerSession(authOptions)
    if (!session) throw new Error("You must be logged in");
    const guestId = session?.user?.guestId;

    const response = await deleteBooking(bookingId, guestId);
    console.log(
        'handleBookingDeleteFormAction',response
    )

    if (!response.success) {
        return { success: false, message: response.message };
    }

    // revalidatePath('/account/reservations');
    return { success: true };
};
