'use client'
import React from 'react'
import { ApiResponseBookingData } from '../_lib/data-service'
import ReForm from './ReForm'
import { useFormState } from 'react-dom'
import { handleBookingUpdateFormAction } from '../_lib/action'
const initialState = {
  success: false,
  message: "",
};
const Holder = ({ formData, bookingId, maxCapacity }: { formData: ApiResponseBookingData, bookingId: number, maxCapacity: number }) => {
  // 🔥 Bind server action with bookingId
  const actionWithData = handleBookingUpdateFormAction.bind(null, bookingId);
  const [state, formAction] = useFormState(actionWithData, initialState);


  return (
    <ReForm
      mode='edit'
      formData={formData}
      formAction={formAction}
      state={state}
      maxCapacity={maxCapacity}
    />
  )
}

export default Holder