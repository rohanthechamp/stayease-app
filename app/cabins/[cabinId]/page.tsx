/* eslint-disable @typescript-eslint/no-unused-vars */
// import { Cabin } from "@/types/cabin";
import Cabin from "@/app/_components/Cabinn";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import type { Metadata } from "next";
import { Suspense } from "react";
// import NotFound from "@/app/not-found";

type PageProps = {
    params: {
        cabinId: string;
    };
    searchParams: string;
};

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    try {
        const cabin = await getCabin(params.cabinId);

        return {
            title: `Cabin ${cabin.name}`,
        };
    } catch (error) {
        // Fallback metadata if cabin not found or API fails
        console.log(error);
        return {
            title: "Cabin",
        };
    }
}

export async function generateStaticParams() {
    const response = await getCabins();
    return response
        .map((data) => ({ cabinId: data.id.toString() }))
        .filter((data) => data.cabinId);
}

export default async function Page({ params }: PageProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const cabin = await getCabin(params.cabinId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cabin = await getCabin(params.cabinId);

    return (
        <div className="max-w-6xl mx-auto mt-8">
            <Cabin cabin={cabin} />
            <div>
                <h2 className="text-6xl font-semibold text-center mb-10 text-accent-400">
                    Reserve {cabin.name} and {cabin.id} today. Pay on arrival.
                </h2>
            </div>

            <Suspense fallback={<Spinner />}>
                <Reservation Cabin={cabin} />
            </Suspense>
        </div>
    );
}
