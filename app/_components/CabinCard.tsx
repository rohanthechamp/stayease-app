
import { Cabin } from "@/types/cabin";
import { UsersIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

import default_cabin from "@/public/hotel-cabin.jpg";

type Props = {
  cabin: Cabin;
};

function CabinCard({ cabin }: Props) {
  const { id, name, regularPrice, maxCapacity, discount, image } = cabin;

  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-primary-800 bg-primary-950 shadow-lg hover:shadow-2xl transition-shadow">
      <Image
        src={image || default_cabin}
        alt={`Cabin ${name}`}
        className="w-full h-48 object-cover"
        quality={100}
        width={400}
        height={200}
      />
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-2xl font-semibold text-accent-500 mb-2">Cabin {name}</h3>
        <div className="flex items-center gap-2 text-primary-200 mb-4">
          <UsersIcon className="h-5 w-5 text-primary-600" />
          <span>For up to <span className="font-bold">{maxCapacity}</span> guests</span>
        </div>
        <div className="mt-auto mb-4">
          {Number(discount) > 0 ? (
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-[350]">${(regularPrice - discount).toFixed(2)}</span>
              <span className="line-through text-primary-600">${regularPrice}</span>
            </div>
          ) : (
            <span className="text-3xl font-[350]">${regularPrice}</span>
          )}
          <span className="text-primary-200"> / night</span>
        </div>
        <Link
          href={`/cabins/${id}`}
          className="mt-auto inline-block w-full text-center py-2 rounded-lg bg-accent-500 text-primary-950 font-medium hover:bg-accent-600 transition-colors"
        >
          Details &amp; reserve
        </Link>
      </div>
    </div>
  );
}

export default CabinCard;
