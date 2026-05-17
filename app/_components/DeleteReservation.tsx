
"use client";

import { TrashIcon } from "@heroicons/react/24/solid";
import { useTransition } from "react";
import SpinnerMini from "./SpinnerMini";
import { toast } from "react-hot-toast";
import { ApiResponseDelete } from "../_lib/data-service";

type Props = {
  bookingId: number;
  onDelete: (bookingId: number) => Promise<ApiResponseDelete>;
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
