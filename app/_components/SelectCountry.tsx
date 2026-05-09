// "use client";
// import { Country, SelectCountryProps } from "@/types/booking";
// // Let's imagine your colleague already built this component 😃

// function SelectCountry({
//   defaultCountry,
//   name,
//   id,
//   className,
//   data,
//   onChange,
// }: SelectCountryProps) {
//   const countries: Country[] = data;
//   return (
//     <select
//       name={name}
//       id={id}
//       // Here we use a trick to encode BOTH the country name and the flag into the value. Then we split them up again later in the server action
//       defaultValue={`${defaultCountry}%${defaultCountry}`}
//       className={className}
//       onChange={onChange}

//     >
//       <option  > {defaultCountry ||'Select country...'}  </option>
//       {countries.map((c) => (
//         <option key={c.name} value={`${c.name}%${c.code}`}>
//           {c.name}
//         </option>
//       ))}
//     </select>
//   );
// }

// export default SelectCountry;
// components/SelectCountry.tsx
"use client";
import { Country, SelectCountryProps } from "@/types/booking";

function SelectCountry({
  defaultCountry,
  name,
  id,
  className,
  data,
  onChange,
}: SelectCountryProps) {
  const countries: Country[] = data;

  // Logic: Check if we have a saved value that isn't the placeholder
  const hasValue = defaultCountry && defaultCountry !== "Select country...";

  return (
    <select
      name={name}
      id={id}
      defaultValue={hasValue ? `${defaultCountry}%` : ""}
      onChange={onChange}
      /* Tailwind Logic: 
         - We keep your base className.
         - If hasValue, we add a subtle border-green or accent color.
         - We use 'bg-opacity' to ensure the background isn't too heavy.
      */
      className={`${className} cursor-pointer transition-all duration-300 ${hasValue
        ? "border-green-600 bg-green-900/10 text-white"
        : "border-gray-600"
        }`}
    >
      {/* The first option acts as the 'State Indicator'. 
          If they have a value, we show it clearly. 
      */}
      <option value={hasValue ? `${defaultCountry}%` : ""}>
        {hasValue ? `📍 ${defaultCountry} (Current)` : "Select country..."}
      </option>

      {countries.map((c) => (
        <option key={c.name} value={`${c.name}%${c.code}`} className="bg-primary-900 text-primary-100">
              {c.name}
        
        </option>
      ))}
    </select>
  );
}

export default SelectCountry;