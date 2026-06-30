import { useForm } from "react-hook-form";
import { Input } from "../../../../shared/ui/Input";

export function PersonalDetailsForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (values: unknown) => {
        void values;
    };

    return (
        <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0b0f19] sm:p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    Personal Details
                </h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Update your name and account email address.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Input
                        label="First Name"
                        type="text"
                        placeholder="Enter your first name"
                        autoComplete="given-name"
                        error={errors.firstName?.message?.toString()}
                        {...register("firstName", {
                            required: "First name is required",
                        })}
                    />
                    <Input
                        label="Last Name"
                        type="text"
                        placeholder="Enter your last name"
                        autoComplete="family-name"
                        error={errors.lastName?.message?.toString()}
                        {...register("lastName", {
                            required: "Last name is required",
                        })}
                    />
                </div>

                <Input
                    label="Email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    error={errors.email?.message?.toString()}
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: "Enter a valid email address",
                        },
                    })}
                />

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                    >
                        Save Details
                    </button>
                </div>
            </form>
        </section>
    );
}
