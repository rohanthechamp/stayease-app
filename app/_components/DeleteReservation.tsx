// import React, { useState } from "react";
// import { deleteBooking } from "../_lib/data-service";
// import SpinnerMini from "./SpinnerMini";
// import toast from "react-hot-toast"; // Add this import

// type Props = {
//   bookingId: number;
// };

// const DeleteReservation = ({ bookingId }: Props) => {
//   const [clicked, setClicked] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleDelete = async () => {
//     if (!confirm("Are you sure you want to delete?")) return;

//     setClicked(true);
//     setError(null);

//     const response = await deleteBooking(bookingId);
//     console.log("response".toUpperCase(), response);

//     if (response.success) {
//       toast.success("Deleted!", {
//         duration: 10000,
//         icon: "🗑️", // Custom emoji
//         style: {
//           borderRight: "4px solid #10b981",
//         },
//       });
//       // window.location.reload(); // Immediately refreshes page
//     } else {
//       setError(response?.message || "Delete failed  !");
//       toast.error(error);
//     }
//     setClicked(false);
//   };

//   return (
//     <div>
//       <button
//         className="border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 font-medium py-4 px-6 rounded-lg transition-colors"
//         disabled={clicked}
//         onClick={handleDelete}
//       >
//         {clicked ? <SpinnerMini /> : "Delete"}
//       </button>
//       {error && <p className="bg-red-600"> {error} </p>}
//     </div>
//   );
// };

// export default DeleteReservation;

// import { TrashIcon } from "@heroicons/react/24/solid";
// import { useTransition } from "react";
// import SpinnerMini from "./SpinnerMini";

// type Props = {
//   bookingId: number;
//   onDelete: (bookingId: number) => void,
//   errorMsg: string
// };
// function DeleteReservation({ bookingId, onDelete, errorMsg }: Props) {
//   const [isPending, startTransition] = useTransition();

//   function handleDelete() {
//     if (confirm("Are you sure you want to delete this reservation?"))
//       startTransition(() => onDelete(bookingId));
//   }

//   return (
//     <>
//       <button
//         onClick={handleDelete}
//         className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900"
//       >
//         {!isPending ? (
//           <>
//             <TrashIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
//             <span className="mt-1">Delete</span>
//           </>
//         ) : (
//           <span className="mx-auto">
//             <SpinnerMini />
//           </span>
//         )}
//       </button>
//       {
//         errorMsg && <p className="bg-red-500 border-x-purple-200 w-4 h-3" >{errorMsg}</p>
//       }</>

//   );
// }

// export default DeleteReservation;
"use client";

import { TrashIcon } from "@heroicons/react/24/solid";
import { useTransition } from "react";
import SpinnerMini from "./SpinnerMini";
import { toast } from "react-hot-toast";

type Props = {
  bookingId: number;
  onDelete: (bookingId: number) => Promise<void>;
};

function DeleteReservation({ bookingId, onDelete }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      "This action cannot be undone. Delete this reservation?",
    );

    if (!confirmed) return;

    startTransition(async () => {
      const res = await onDelete(bookingId);

      if (!res.success) {
        toast.error(res.message || "Failed to delete reservation");
        return;
      }

      toast.success("Reservation deleted successfully");
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={`
        group flex items-center justify-center gap-2 
        px-10 py-3 rounded-lg 
        text-xs font-semibold uppercase tracking-wide
        transition-all duration-200
        ${isPending
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-red-500 hover:bg-red-600 active:scale-95"
        }
        text-white shadow-sm hover:shadow-md
      `}
    >
      {isPending ? (
        <SpinnerMini />
      ) : (
        <>
          <TrashIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
          <span>Delete</span>
        </>
      )}
    </button>
  );
}

export default DeleteReservation;
