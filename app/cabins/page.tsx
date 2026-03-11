import { Suspense } from "react";
import CabinList from "../_components/CabinList";
import Spinner from "../_components/Spinner";
import Filter from "../_components/Filter";
import ReservationReminder from "../_components/ReservationReminder";

export const revalidate = 3600; // ISR is here
// export const revalidate = 6;

export const metadata = {
  title: "Cabins",
};

type Props = {
  searchParams: Record<string, string | undefined>;
};

export default function Page({ searchParams }: Props) {
  const filter: string = searchParams?.capacity ?? "all";
  // console.log("searchParams", searchParams);

  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        Our Luxury Cabins
      </h1>

      <p className="text-primary-200 text-lg mb-10">
        Cozy yet luxurious cabins located in the heart of the Dolomites.
      </p>

      <div className="flex justify-end mb-8">
        <Filter />
      </div>

      <Suspense fallback={<Spinner />} key={filter}>
        <CabinList filter={filter} />
      </Suspense>

      <ReservationReminder/>
    </div>
  );
}
