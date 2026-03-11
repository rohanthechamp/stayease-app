import { Cabin, CabinAPI } from "@/types/cabin";

export function transformCabin(data: CabinAPI): Cabin {
  return {
    id: data.id,
    name: data.name,
    maxCapacity: data.maxCapacity,
    created_at: new Date(data.created_at),
    regularPrice: Number(data.regularPrice),
    discount: Number(data.discount),
    image: data.image,
  };
}