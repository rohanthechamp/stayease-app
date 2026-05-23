"use client";
import { AppDateRange } from "../_context/ReservatationContext";
import { SubmitButton } from "./SubmitButton";
type BaseProps = {
    maxCapacity: number;
    state: {
        success: boolean;
        message: string;
    };
    formAction: (formData: FormData) => void;
};

type CreateModeProps = BaseProps & {
    mode: "create";
    range: AppDateRange;
    hasConflict: boolean;
    isValidRange: boolean;
};

type EditModeProps = BaseProps & {
    mode: "edit";
    formData: { observations: string; numGuests: number };
};

type FormProps = CreateModeProps | EditModeProps;
const ReForm = (props: FormProps) => {
    const { mode, maxCapacity, state, formAction } = props;

    const numGuestsDefault =
        mode === "edit" ? props.formData.numGuests : undefined;

    const observationsDefault =
        mode === "edit" ? props.formData.observations : "";

    return (
        <form
            className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col"
            action={formAction}
        >
            {/* Guests */}
            <div className="space-y-2">
                <label htmlFor="numGuests">How many guests?</label>

                <select
                    defaultValue={numGuestsDefault}
                    name="numGuests"
                    id="numGuests"
                    className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
                    required
                >
                    <option value="">Select number of guests...</option>

                    {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
                        <option value={x} key={x}>
                            {x} {x === 1 ? "guest" : "guests"}
                        </option>
                    ))}
                </select>
            </div>

            {/* Observations */}
            <div className="space-y-2">
                <label htmlFor="observations">
                    Anything we should know about your stay?
                </label>

                <textarea
                    defaultValue={observationsDefault}
                    name="observations"
                    id="observations"
                    className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
                    placeholder="Any pets, allergies, special requirements, etc.?"
                />
            </div>

            {state.message && (
                <p style={{ color: state.success ? "green" : "red" }}>
                    {state.message}
                </p>
            )}
            {mode === "create" ? (
                <CreateSection
                    range={props.range}
                    hasConflict={props.hasConflict}
                    isValidRange={props.isValidRange}
                />
            ) : (
                <SubmitButton  msg={'Updating booking'} />
            )}
        </form>
    );
};

export default ReForm;

const CreateSection = ({
    range,
    hasConflict,
    isValidRange,
}: {
        range: AppDateRange;
    hasConflict: boolean;
    isValidRange: boolean;
}) => {
    return (
        <>
            {!range.from || !range.to ? (
                <p className="text-primary-300 text-base">
                    Please select dates before booking
                </p>
            ) : hasConflict ? (
                <p className="text-red-500">
                    Selected dates include already booked days
                </p>
            ) : null}

            {isValidRange && <SubmitButton msg ={'Creating Booking'} />}
        </>
    );
};
