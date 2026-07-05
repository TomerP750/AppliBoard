import { useMutation, useQuery } from "@tanstack/react-query";
import { UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../shared/ui/Button";
import { Input } from "../../../../shared/ui/Input";
import userService from "../api/userService";
import type { UpdateUserDto } from "../models/UpdateUserDto";
import { Badge } from "../../../../shared/ui/Badge";
import type { UserDto } from "../../../../shared/models/UserDto";

export function PersonalDetailsForm() {

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<UpdateUserDto>();

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

    const { data: user } = useQuery<UserDto>({
        queryKey: ["user"],
        queryFn: () => userService.me(),
    });

    return (
        <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-6">

            <div className="flex items-center gap-10 mb-6">

                <header className="flex flex-col">
                    <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                        <UserIcon className="h-5 w-5" />
                        <span>Personal Details</span>
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        Update your name and account email address.
                    </p>
                </header>

                <div className="flex items-center gap-2">
                    {/* Avatar url input */}
                    <Badge 
                    firstName={user?.firstName}
                    lastName={user?.lastName}
                    avatarUrl={user?.avatarUrl} 
                    size="lg" 
                    className="rounded-xl"/>

                    <Input
                        label="Avatar URL"
                        type="text"
                        className="bg-neutral-100! dark:bg-zinc-800! w-full!"
                        placeholder="Enter your avatar URL"
                        autoComplete="avatar-url"
                        error={errors.avatarUrl?.message?.toString()}
                        {...register("avatarUrl")}
                    />
                </div>

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
                            minLength: {
                                value: 3,
                                message: "First name must be at least 3 characters long",
                            },
                            maxLength: {
                                value: 50,
                                message: "First name must be less than 50 characters long",
                            },
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
                            minLength: {
                                value: 3,
                                message: "Last name must be at least 3 characters long",
                            },
                            maxLength: {
                                value: 50,
                                message: "Last name must be less than 50 characters long",
                            },
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
