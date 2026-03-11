"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

import React from "react";
type FilterType = "all" | "small" | "medium" | "large";
const Filter = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const activeFilter: string = searchParams?.get("capacity") ??"all";
    function handleFilter(filter: FilterType) {
        const params = new URLSearchParams(searchParams);

        params.set("capacity", filter);
        router.replace(`${pathname}?${params.toString()}`);
    }
    return (
        <div className="border border-primary-800 flex">
            <Button
                filter="all"
                handleFilter={handleFilter}
                activeFilter={activeFilter}
            >
                All cabins
            </Button>
            <Button
                filter="small"
                handleFilter={handleFilter}
                activeFilter={activeFilter}
            >
                2&mdash;3 guests
            </Button>
            <Button
                filter="medium"
                handleFilter={handleFilter}
                activeFilter={activeFilter}
            >
                4&mdash;7 guests
            </Button>
            <Button
                filter="large"
                handleFilter={handleFilter}
                activeFilter={activeFilter}
            >
                8&mdash;12 guests
            </Button>
        </div>
    );
};

export default Filter;

type ButtonProps = PropsWithChildren<{
    filter: FilterType;
    handleFilter: (filterValue: FilterType) => void;
    activeFilter: string;
}>;

export function Button({
    filter,
    handleFilter,
    children,
    activeFilter,
}: ButtonProps) {
    return (
        <button
            className={`px-5 py-2 hover:bg-primary-700 ${filter === activeFilter ? "bg-primary-700 text-primary-50" : ""
                }`}
            onClick={() => handleFilter(filter)}
        >
            {children}
        </button>
    );
}
