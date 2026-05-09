import SelectCountry from "@/app/_components/SelectCountry";
import UpdateProfileForm from "@/app/_components/UpdateProfileForm";
import { getCountries } from "@/app/_lib/data-service";

import { Country } from "@/types/booking";

export default async function Page() {
  // CHANGE
  const countries: Country[] = await getCountries();
  console.log('all Countries',countries.slice(0,2),countries.length)

  const nationality = "us";
  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-4">
        Update your guest profile
      </h2>

      <p className="text-lg mb-8 text-primary-200">
        Providing the following information will make your check-in process
        faster and smoother. See you soon!
      </p>
      <UpdateProfileForm data={countries}>
        <SelectCountry
          name="nationality"
          id="nationality"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          defaultCountry={nationality}
          data={countries}
        />
      </UpdateProfileForm>
    </div>
  );
}
