

import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";

import { getCabins } from "@/app/_lib/data-service";
import { authOptions } from "@/app/_lib/auth";

import default_cabin from "@/public/hotel-cabin.jpg";
import { Cabin } from "../types/cabin";

export const metadata = {
  title: "Home / StayEase",
};

/* =========================
   SKELETON COMPONENT
========================= */
function CabinSkeleton() {
  return (
    <div className="bg-primary-900 border border-primary-800 rounded-3xl overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-primary-800" />

      <div className="p-6 space-y-4">
        <div className="h-4 bg-primary-800 rounded w-2/3" />
        <div className="h-3 bg-primary-800 rounded w-1/2" />
        <div className="h-6 bg-primary-800 rounded w-1/3 mt-4" />
        <div className="h-10 bg-primary-800 rounded mt-6" />
      </div>
    </div>
  );
}

export default async function Page() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session;

  let cabins: Cabin[] = [];
  try {
    cabins = await getCabins();
  } catch (error) {
    console.error("Error fetching cabins:", error);
  }

  const featuredCabins = cabins.slice(0, 3);

  return (
    <div className="space-y-24 md:space-y-32 pb-16">

      {/* HERO */}
      <section className="text-center max-w-4xl mx-auto pt-16 space-y-6">
        <span className="text-accent-500 text-xs uppercase tracking-widest">
          A New Era of Retreat
        </span>

        <h1 className="text-6xl font-light text-primary-100">
          Sanctuaries in the wild.
        </h1>

        <p className="text-lg text-primary-300 max-w-2xl mx-auto">
          StayEase offers a minimalist approach to mountain living.
        </p>
      </section>

      {/* FEATURED CABINS */}
      <section className="space-y-12 max-w-7xl mx-auto px-4">
        <div className="flex justify-between border-b border-primary-800 pb-6">
          <h2 className="text-3xl text-primary-100">
            Featured Sanctuaries
          </h2>

          <Link href="/cabins" className="text-accent-500">
            View all →
          </Link>
        </div>

        {featuredCabins.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">

            {featuredCabins.map((cabin) => {
              const {
                id,
                name,
                regularPrice,
                maxCapacity,
                discount,
                image,
              } = cabin;

              const hasDiscount = discount > 0;
              const finalPrice = hasDiscount
                ? regularPrice - discount
                : regularPrice;

              // 🔥 fake urgency
              const fakeAvailability = Math.floor(Math.random() * 3) + 1;

              return (
                <div
                  key={id}
                  className="group bg-primary-900 border border-primary-800 rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  {/* IMAGE */}
                  <div className="relative aspect-[4/3] overflow-hidden">

                    <Image
                      src={image || default_cabin}
                      alt={`Cabin ${name}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* 🔥 BADGE */}
                    {fakeAvailability <= 2 && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full shadow">
                        Only {fakeAvailability} left
                      </div>
                    )}
                  </div>

                  {/* BODY */}
                  <div className="p-6 flex flex-col justify-between flex-grow">

                    <div>
                      <h3 className="text-xl text-primary-100">
                        Cabin {name}
                      </h3>

                      <p className="text-sm text-primary-400">
                        Up to {maxCapacity} guests
                      </p>
                    </div>

                    {/* PRICE */}
                    <div className="mt-4">
                      <p className="text-2xl font-semibold text-primary-100">
                        ${finalPrice.toFixed(2)}
                      </p>

                      {hasDiscount && (
                        <p className="text-sm line-through text-primary-500">
                          ${regularPrice}
                        </p>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="mt-6 space-y-2">

                      {isLoggedIn ? (
                        <Link
                          href={`/cabins/${id}`}
                          className="block text-center bg-primary-800 hover:bg-accent-500 hover:text-primary-950 text-primary-200 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                        >
                          Reserve Cabin
                        </Link>
                      ) : (
                        <>
                          <Link
                            href={`/signin?callbackUrl=/cabins/${id}`}
                            className="block text-center bg-primary-800 hover:bg-accent-500 hover:text-primary-950 text-primary-200 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.03]"
                          >
                            Sign in to Reserve
                          </Link>

                          <p className="text-xs text-primary-500 text-center">
                            Login required for booking
                          </p>
                        </>
                      )}

                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <CabinSkeleton key={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}