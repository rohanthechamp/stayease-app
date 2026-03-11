// 'use client'
import { Country, SelectCountryProps } from "@/types/booking";
import { getCountries } from "../_lib/data-service";
// Let's imagine your colleague already built this component 😃

 async function SelectCountry({
  defaultCountry,
  name,
  id,
  className,
  // data,
  // onChange
}: SelectCountryProps) {
   const countries: Country[  ] = await getCountries();
;

  return (
    <select
      name={name}
      id={id}
      // Here we use a trick to encode BOTH the country name and the flag into the value. Then we split them up again later in the server action
      defaultValue={`${defaultCountry}%${defaultCountry}`}
      className={className}
    // onChange={onChange}
    >
      <option value="">Select country...</option>
      {countries.map((c) => (
        <option key={c.name} value={`${c.name}%${c.code}`}>
          {c.name}
        </option>
      ))}
    </select>
  );
}

export default SelectCountry;
