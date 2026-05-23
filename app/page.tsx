import Link from "next/link";
import Image from "next/image";
import { getCabins } from "@/app/_lib/data-service";
import default_cabin from "@/public/hotel-cabin.jpg";
import { Cabin } from "../types/cabin";

export const metadata = {
  title: "Home / StayEase",
};

export default async function Page() {
  // Fetch cabins dynamically from the data service
  let cabins :Cabin[]= [];
  try {
    cabins = await getCabins();
  } catch (error) {
    console.error("Error fetching cabins for homepage:", error);
  }

  // Pick the first 3 cabins to display as featured
  const featuredCabins = cabins.slice(0, 3);

  return (
    <div className="space-y-24 md:space-y-32 pb-16">
      
      {/* 1. Minimalist Editorial Hero Section */}
      <section className="text-center max-w-4xl mx-auto pt-12 md:pt-20 space-y-6">
        <span className="text-accent-500 font-semibold tracking-wider text-xs uppercase block">
          A New Era of Retreat
        </span>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-light text-primary-100 tracking-tight leading-tight">
          Sanctuaries in the wild.
        </h1>
        <p className="text-lg sm:text-xl text-primary-300 max-w-2xl mx-auto font-light leading-relaxed">
          StayEase offers a minimalist approach to mountain living. Discover thoughtfully designed architectural cabins in the heart of the Italian Dolomites, curated for silence and deep restoration.
        </p>
      </section>

      {/* 2. Search-First / Booking Card Widget */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-primary-900 border border-primary-800 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-center">
            
            {/* Column 1: Destination */}
            <div className="space-y-1 md:border-r border-primary-800 md:pr-6">
              <span className="text-xs text-primary-500 uppercase tracking-widest block font-medium">
                Destination
              </span>
              <p className="text-lg font-medium text-primary-100">
                Dolomites, Italy
              </p>
              <span className="text-xs text-primary-400">
                Surrounding valleys & mountains
              </span>
            </div>

            {/* Column 2: Capacity */}
            <div className="space-y-1 md:border-r border-primary-800 md:px-6">
              <span className="text-xs text-primary-500 uppercase tracking-widest block font-medium">
                Availability
              </span>
              <p className="text-lg font-medium text-primary-200">
                Flexible dates
              </p>
              <span className="text-xs text-primary-400">
                All seasons active
              </span>
            </div>

            {/* Column 3: Action */}
            <div className="md:pl-6 flex justify-stretch">
              <Link
                href="/cabins"
                className="w-full bg-accent-500 hover:bg-accent-600 text-primary-950 font-semibold py-4 px-6 rounded-2xl text-center transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>Find Your Cabin</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Category Filter Chips (Visual Engagement) */}
      <section className="max-w-4xl mx-auto text-center space-y-4 px-4">
        <p className="text-xs font-semibold text-primary-500 tracking-wider uppercase">
          Filter by experience
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { label: "All Cabins", query: "all" },
            { label: "Small (2-3 guests)", query: "small" },
            { label: "Medium (4-7 guests)", query: "medium" },
            { label: "Large (8-12 guests)", query: "large" },
          ].map((chip) => (
            <Link
              key={chip.label}
              href={`/cabins?capacity=${chip.query}`}
              className="bg-primary-900 border border-primary-800 text-sm text-primary-200 px-5 py-2.5 rounded-full hover:bg-primary-800 hover:text-accent-500 hover:border-accent-500/30 transition-all duration-200"
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Cabins Section */}
      <section className="space-y-12 max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-primary-800 pb-6">
          <div>
            <h2 className="text-3xl font-light text-primary-100 tracking-tight">
              Featured Sanctuaries
            </h2>
            <p className="text-primary-300 text-sm mt-1">
              Hand-selected escapes offering pristine views and custom amenities.
            </p>
          </div>
          <Link
            href="/cabins"
            className="text-accent-500 hover:text-accent-600 font-medium text-sm flex items-center gap-1 group"
          >
            <span>View all cabins</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>

        {featuredCabins.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCabins.map((cabin) => {
              const { id, name, regularPrice, maxCapacity, discount, image } = cabin;
              const hasDiscount = Number(discount) > 0;
              const finalPrice = hasDiscount ? regularPrice - discount : regularPrice;

              return (
                <div
                  key={id}
                  className="group bg-primary-900 border border-primary-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
                >
                  {/* Card Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary-800">
                    <Image
                      src={image || default_cabin}
                      alt={`Cabin ${name}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale-[20%] group-hover:grayscale-0"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {hasDiscount && (
                      <div className="absolute top-4 right-4 bg-accent-500 text-primary-950 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                        Save ${discount}
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-grow justify-between space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-medium text-primary-100">
                          Cabin {name}
                        </h3>
                        <span className="text-xs text-primary-400 bg-primary-800 px-2.5 py-1 rounded-md">
                          Up to {maxCapacity} guests
                        </span>
                      </div>
                      <p className="text-sm text-primary-300 line-clamp-2">
                        A peaceful mountain retreat, elegantly integrated into surrounding nature. Built with raw local timber.
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-primary-800/80">
                      <div>
                        <span className="text-xs text-primary-500 block uppercase tracking-wider">
                          Price per night
                        </span>
                        <p className="flex items-baseline gap-2">
                          <span className="text-2xl font-semibold text-primary-100">
                            ${finalPrice}
                          </span>
                          {hasDiscount && (
                            <span className="text-sm line-through text-primary-500">
                              ${regularPrice}
                            </span>
                          )}
                        </p>
                      </div>

                      <Link
                        href={`/cabins/${id}`}
                        className="bg-primary-800 hover:bg-accent-500 hover:text-primary-950 text-primary-200 text-sm font-semibold py-3 px-5 rounded-xl transition-all duration-200 shadow-sm"
                      >
                        Book Sanctuary
                      </Link>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-primary-900 border border-primary-800 rounded-3xl">
            <p className="text-primary-300">Discovering architectural sanctuaries...</p>
          </div>
        )}
      </section>

      {/* 5. Brand Pillars (Values section) */}
      <section className="bg-primary-900 border-y border-primary-800 py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-accent-500 text-xs font-semibold uppercase tracking-widest">
              Core Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-light text-primary-100 tracking-tight">
              Designed for peaceful grounding.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            
            {/* Pillar 1 */}
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accent-500/10 flex items-center justify-center mx-auto md:mx-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-accent-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-primary-100">
                Architectural Harmony
              </h3>
              <p className="text-primary-300 text-sm leading-relaxed">
                Our cabins are crafted using locally sourced stone and ancient timber, designed to disappear gracefully into the surrounding spruce trees and rock walls.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accent-500/10 flex items-center justify-center mx-auto md:mx-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-accent-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-primary-100">
                Intuitive Solitude
              </h3>
              <p className="text-primary-300 text-sm leading-relaxed">
                Enjoy fully contactless check-ins and curated offline amenities. We provide everything you need to switch off entirely, unplug, and feel completely grounded.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accent-500/10 flex items-center justify-center mx-auto md:mx-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-accent-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12.75 3.03v.568c0 .334.148.65.405.864l4.038 3.332a.75.75 0 0 1 .288.583V9.3c0 .324-.108.638-.307.892l-4.103 5.25a.75.75 0 0 1-.588.291h-1.3c-.3 0-.583-.12-.787-.334l-1.3-1.36a.75.75 0 0 1-.163-.787l2.25-6a.75.75 0 0 1 .703-.487h1.096a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-.75"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-primary-100">
                Ecological Stewardship
              </h3>
              <p className="text-primary-300 text-sm leading-relaxed">
                Each sanctuary is powered by 100% renewable geothermal and solar grids, ensuring that your escape leaves zero footprint on the fragile alpine ecosystem.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}