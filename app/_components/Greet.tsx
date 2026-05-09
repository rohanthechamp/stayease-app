'use client';
import React, { useEffect } from 'react'
import { useSearchParams } from "next/navigation";

const Greet = () => {
    const searchParams = useSearchParams();
    const success = searchParams.get("success");
    const message = searchParams.get("message");

    useEffect(() => {
        if (success) {
            alert(message);
        }
    }, [success, message]);
    return (
        <div>Greet</div>
    )
}

export default Greet