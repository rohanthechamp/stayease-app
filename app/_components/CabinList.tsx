import React from "react";
import CabinCard from "./CabinCard";
import { Cabin } from "@/types/cabin";
import { MapPinIcon } from "@heroicons/react/24/outline";

const CabinList = async ({ filter,cabins }: { filter: string,cabins:Cabin[] }) => {
    // noStore()

    if (cabins && cabins.length === 0) return null;
    let displayedCabins: Cabin[] = cabins;
    if (filter === "small")
        displayedCabins = cabins.filter((cabin) => cabin.maxCapacity <= 3);
    else if (filter === "medium")
        displayedCabins = cabins.filter((cabin) => cabin.maxCapacity >= 4);
    else if (filter === "large")
        displayedCabins = cabins.filter((cabin) => cabin.maxCapacity >= 8);

    // ... Inside your component

    if (displayedCabins.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] px-4 py-20 text-center   rounded-xl">
                {/* Decorative Icon Container */}
                <div className="bg-stone-100 p-4 rounded-full mb-2">
                    <MapPinIcon className="h-10 w-10 text-stone-400" strokeWidth={1.5} />
                </div>

                {/* Message Content */}
                <h3 className="text-2xl font-semibold text-stone-800 tracking-tight">
                    No cabins found
                </h3>
                <p className="mt-2 text-stone-600 max-w-sm mx-auto leading-relaxed">
                    We couldn't find any cabins matching your current filters. Try
                    adjusting your selection or clearing the search.
                </p>

                {/* Optional: Add a subtle call to action link here if needed */}
            </div>
        );
    }

    // if (displayedCabins.length === 0) {
    //     return (
    //         <div className="flex flex-col items-center justify-center gap-4 py-16 text-stone-500">
    //             {/* Heroicon चा वापर */}
    //             <HomeModernIcon className="h-12 w-12 text-stone-400" />

    //             <div className="text-center">
    //                 <p className="text-lg font-semibold text-stone-600">
    //                     दाखवण्यासाठी कोणतीही केबिन उपलब्ध नाही
    //                 </p>
    //                 <p className="text-stone-500">
    //                     तुमचा फिल्टर बदलून पहा किंवा नंतर प्रयत्न करा.
    //                 </p>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
            {displayedCabins
                .filter((cabin) => cabin.id !== 499)
                .map((cabin) => (
                    <CabinCard cabin={cabin} key={cabin.id} />
                ))}
        </div>
    );
};

export default CabinList;
