import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import type { SignupRequestDto } from "../models/SignupRequestDto";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";

export function SignupPage() {

    const { register, handleSubmit, formState: { errors } } = useForm<SignupRequestDto>();
    
    const handleSignup = async (_dto: SignupRequestDto) => {


    }
    
    return (
        <form
            onSubmit={handleSubmit(handleSignup)}
            className="w-full space-y-5 rounded-2xl border border-white/15 p-6 shadow-2xl backdrop-blur-sm sm:p-8"
        >
            <h1 className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Sign up
            </h1>

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-white">
                        First name
                    </label>
                    <Input
                        id="firstName"
                        type="text"
                        {...register("firstName", { required: "First name is required" })}
                        placeholder="John"
                        autoComplete="given-name"
                        className="border-white/25 bg-transparent text-white placeholder:text-zinc-300"
                        error={errors.firstName?.message?.toString()}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-white">
                        Last name
                    </label>
                    <Input
                        id="lastName"
                        type="text"
                        {...register("lastName", { required: "Last name is required" })}
                        placeholder="Doe"
                        autoComplete="family-name"
                        className="border-white/25 bg-transparent text-white placeholder:text-zinc-300"
                        error={errors.lastName?.message?.toString()}
                    />
                </div>
            </div>
            <label htmlFor="email" className="block text-sm font-medium text-white">
                Email
            </label>
            <Input
                id="email"
                type="email"
                {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" },
                })}
                placeholder="name@example.com"
                autoComplete="email"
                className="border-white/25 bg-transparent text-white placeholder:text-zinc-300"
                error={errors.email?.message?.toString()}
            />
            <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
            </label>
            <Input
                id="password"
                type="password"
                {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                placeholder="Create a password"
                autoComplete="new-password"
                className="border-white/25 bg-transparent text-white placeholder:text-zinc-300"
                error={errors.password?.message?.toString()}
            />
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                Confirm password
            </label>
            <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", { required: "Please confirm your password" })}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                className="border-white/25 bg-transparent text-white placeholder:text-zinc-300"
                error={errors.confirmPassword?.message?.toString()}
            />
            <p className="text-center text-sm text-white/90">
                Already have an account?{" "}
                <Link to="/auth/login" className="font-semibold text-white underline underline-offset-4">
                    Login
                </Link>
            </p>
            <Button type="submit" className="w-full">
                Create account
            </Button>
        </form>
    )
}