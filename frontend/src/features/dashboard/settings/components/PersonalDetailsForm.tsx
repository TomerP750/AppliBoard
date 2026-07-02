import { useForm } from "react-hook-form";
import { Input } from "../../../../shared/ui/Input";
import type { UpdateUserDto } from "../models/UpdateUserDto";
import userService from "../api/userService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "../../../../shared/ui/Button";
import type { UserDto } from "../../../../shared/models/UserDto";
import { UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function PersonalDetailsForm() {

    const navigate = useNavigate();
    
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<UpdateUserDto>();

    const { data: user } = useQuery<UserDto>({
        queryKey: ["user"],
        queryFn: () => userService.me(),
        // onSuccess: (data) => {
        //     setValue("firstName", data.firstName);
        //     setValue("lastName", data.lastName);
        //     setValue("email", data.email);
        //     setValue("avatarUrl", data.avatarUrl);
        // },
    });

    const { mutate: updateUser, isPending } = useMutation({
        mutationFn: (dto: UpdateUserDto) => userService.updateUser(dto),
        onSuccess: () => {
            navigate("/dashboard");
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const handleUpdateUser = (dto: UpdateUserDto) => {
        updateUser(dto);
    };

    return (
        <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-6">
            <div className="mb-6">
                <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    <UserIcon className="h-5 w-5" />
                    <span>Personal Details</span>
                </h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Update your name and account email address.
                </p>
            </div>

            <form onSubmit={handleSubmit(handleUpdateUser)} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Input
                        label="First Name"
                        type="text"
                        className="bg-neutral-100! dark:bg-zinc-800!"
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
                        className="bg-neutral-100! dark:bg-zinc-800!"
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
                    className="bg-neutral-100! dark:bg-zinc-800!"
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
                    <Button
                        type="submit"
                        loading={isPending}
                        className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                    >
                        Save Details
                    </Button>
                </div>
            </form>
        </section>
    );
}
