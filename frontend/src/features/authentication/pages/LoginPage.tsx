import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { ApiErrorResponse } from "../../../shared/models/ApiErrorResponse";
import { Button } from "../../../shared/ui/Button";
import { Input } from "../../../shared/ui/Input";
import { useAuth } from "../contexts/AuthContext";
import type { LoginRequestDto } from "../models/LoginRequestDto";

export function LoginPage() {

    const { login: authLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";

    const { register, handleSubmit, formState: { errors } } = useForm<LoginRequestDto>();

    const { mutate: loginUser, isPending } = useMutation<void, AxiosError<ApiErrorResponse>, LoginRequestDto>({
        mutationFn: (dto: LoginRequestDto) => authLogin(dto),
        onSuccess: () => {
            navigate(from, { replace: true });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message ?? "Login failed. Please try again.");
        },
    });

    const handleLogin = (dto: LoginRequestDto) => {
        loginUser(dto);
    };


    return (
        <section className="flex flex-col items-center justify-center h-screen">
            <h1 className="mb-3 text-center text-2xl font-semibold tracking-tight dark:text-white sm:text-3xl">
                Sign in to your account
            </h1>
            <form
                onSubmit={handleSubmit(handleLogin)}
                className="w-md max-w-2xl space-y-5 rounded-2xl border border-white/10 p-6 shadow-2xl backdrop-blur-sm sm:p-8"
            >
                
                <Input
                    id="email"
                    type="email"
                    label="Email"
                    {...register("email", {
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" }
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
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="border-white/25 bg-transparent! text-white placeholder:text-zinc-300"
                    error={errors.password?.message?.toString()}
                />
                <p className="text-center text-sm text-white/90">
                    Don't have account?{" "}
                    <Link to="/auth/signup" className="font-semibold text-white underline underline-offset-4">
                        Sign up
                    </Link>
                </p>

                <Button type="submit" loading={isPending} disabled={isPending} className="w-full">
                    Login
                </Button>

            </form>
        </section>
    )
}