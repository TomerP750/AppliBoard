import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import type { SignupRequestDto } from "../models/SignupRequestDto";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../../shared/models/ApiErrorResponse";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

export function SignupPage() {

    const navigate = useNavigate();

    const { signup: authSignup } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm<SignupRequestDto>();

    const { mutate: signup, isPending } = useMutation<void, AxiosError<ApiErrorResponse>, SignupRequestDto>({
        mutationFn: (dto: SignupRequestDto) => authSignup(dto),
        onSuccess: () => {
            navigate("/dashboard");
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            toast.error(error.response?.data?.message ?? "Signup failed. Please try again.");
        },
    });

    const handleSignup = (dto: SignupRequestDto) => {
        signup(dto);
    };

    return (
        <section className="flex flex-col items-center justify-center h-screen">
            <h1 className="mb-3 text-center text-2xl font-semibold tracking-tight dark:text-white sm:text-3xl">
                Create an account
            </h1>
            <form
                onSubmit={handleSubmit(handleSignup)}
                className="w-md max-w-2xl space-y-5 rounded-2xl border border-white/10 p-6 shadow-2xl backdrop-blur-sm sm:p-8"
            >
                <div className="grid gap-5 sm:grid-cols-2">
                    
                    <Input
                        id="firstName"
                        type="text"
                        label="First name"
                        {...register("firstName", { required: "First name is required" })}
                        required
                        placeholder="John"
                        autoComplete="given-name"
                        className="border-white/25 bg-transparent! text-white placeholder:text-zinc-300"
                        error={errors.firstName?.message?.toString()}
                    />



                    <Input
                        id="lastName"
                        type="text"
                        label="Last name"
                        {...register("lastName", { required: "Last name is required" })}
                        required
                        placeholder="Doe"
                        autoComplete="family-name"
                        className="border-white/25 bg-transparent! text-white placeholder:text-zinc-300"
                        error={errors.lastName?.message?.toString()}
                    />

                </div>

                <Input
                    id="email"
                    type="email"
                    label="Email"
                    {...register("email", {
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" },
                    })}
                    required
                    placeholder="name@example.com"
                    autoComplete="email"
                    className="border-white/25 bg-transparent! text-white placeholder:text-zinc-300"
                    error={errors.email?.message?.toString()}
                />

                <Input
                    id="password"
                    type="password"
                    label="Password"
                    {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Password must be at least 6 characters" },
                    })}
                    required
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className="border-white/25 bg-transparent! text-white placeholder:text-zinc-300"
                    error={errors.password?.message?.toString()}
                />
                <Input
                    id="confirmPassword"
                    type="password"
                    label="Confirm password"
                    {...register("confirmPassword", { required: "Please confirm your password" })}
                    required={true}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    className="border-white/25 bg-transparent! text-white placeholder:text-zinc-300"
                    error={errors.confirmPassword?.message?.toString()}
                />
                <p className="text-center text-sm text-white/90">
                    Already have an account?{" "}
                    <Link to="/auth/login" className="font-semibold text-white underline underline-offset-4">
                        Login
                    </Link>
                </p>
                <Button loading={isPending} disabled={isPending} type="submit" className="w-full">
                    Create account
                </Button>
            </form>
        </section>
    )
}