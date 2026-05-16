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
    console.log('   /reservations/edit/${id} ')

    const response = await getBookingData(params.bookingId)
    console.log('booking ,',response)
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