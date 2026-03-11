import Image from "next/image";
import banner from "@/app/bg.png";
// import { useState } from "react";

export const metadata = {
  title: "Guest Area",
};

export default function Page() {
  return (
    <>
      {/* Full-page background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={banner}
          fill
          className="object-cover"
          alt="Mountains and forests with two cabins"
          placeholder="blur"
          quality={90}
          priority
        />
        {/* Optional overlay for readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Page content */}
      <main className="mt-24 min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-8xl text-primary-50 mb-10 tracking-tight font-normal">
          Welcome to paradise.
        </h1>

        <a
          href="/cabins"
          className="bg-accent-500 px-8 py-6 text-primary-800 text-lg font-semibold hover:bg-accent-600 transition-all"
        >
          Explore luxury cabins
        </a>
      </main>
    </>
  );
}