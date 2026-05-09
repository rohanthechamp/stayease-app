"use client";
import { useFormStatus } from "react-dom";

type Props = {
    msg?: string;
    pendingMsg?: string;
};

export function SubmitButton({
    msg = "Submit",
    pendingMsg = "Processing...",
}: Props) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            aria-disabled={pending}
            className={`bg-accent-500 px-8 py-4 font-semibold transition-all
            ${
                pending
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-accent-600"
            }`}
        >
            {pending ? pendingMsg : msg}
        </button>
    );
}