import Holder from '@/app/_components/Holder';
import {  getBookingData } from '@/app/_lib/data-service';
import React from 'react'



type PageProps = {
    params: {
        bookingId: number;
    };
    searchParams: string;
};

const page = async ({ params }: PageProps) => {

    const response = await getBookingData(params.bookingId)
    const formData = response
    const maxCapacity=formData.numGuests

    return (
        <Holder
            formData={formData}
            bookingId={params.bookingId}
            maxCapacity={maxCapacity}
        />
    )
}

export default page