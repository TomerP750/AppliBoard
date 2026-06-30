import { useForm } from "react-hook-form";
import { Input } from "../../../../shared/ui/Input";

export function ChangePasswordForm() {
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
                    Change Password
                </h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Choose a strong password to keep your account secure.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <Input
                    label="Current Password"
                    type="password"
                    placeholder="Enter your current password"
                    autoComplete="current-password"
                    error={errors.currentPassword?.message?.toString()}
                    {...register("currentPassword", {
                        required: "Current password is required",
                    })}
                />
                <Input
                    label="New Password"
                    type="password"
                    placeholder="Enter your new password"
                    autoComplete="new-password"
                    error={errors.newPassword?.message?.toString()}
                    {...register("newPassword", {
                        required: "New password is required",
                        minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                        },
                    })}
                />
                <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
                    error={errors.confirmNewPassword?.message?.toString()}
                    {...register("confirmNewPassword", {
                        required: "Please confirm your new password",
                    })}
                />

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                    >
                        Update Password
                    </button>
                </div>
            </form>
        </section>
    );
}
