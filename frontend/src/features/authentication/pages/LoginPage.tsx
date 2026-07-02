import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import type { LoginRequestDto } from "../models/LoginRequestDto";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";
import { useAuth } from "../contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { Toast } from "../../../shared/ui/Toast";
import { useState } from "react";
import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../../shared/models/ApiErrorResponse";

export function LoginPage() {

    const [toastMessage, setToastMessage] = useState<string | null>(null);
    
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();
    
    const { register, handleSubmit, formState: { errors } } = useForm<LoginRequestDto>();

    const { mutate: loginUser, isPending } = useMutation<void, AxiosError<ApiErrorResponse>, LoginRequestDto>({
        mutationFn: (dto: LoginRequestDto) => authLogin(dto),
        onSuccess: () => {
            navigate("/dashboard");
        },
        onError: (err) => {
            setToastMessage(err.response?.data?.message ?? "Login failed. Please try again.");
        },
    });

    const handleLogin = (dto: LoginRequestDto) => {
        loginUser(dto);
    };
    

    return (
        <form
            onSubmit={handleSubmit(handleLogin)}
            className="w-full space-y-5 rounded-2xl border border-white/15 p-6 shadow-2xl backdrop-blur-sm sm:p-8"
        >
            {toastMessage && <Toast type="error" message={toastMessage} onClose={() => setToastMessage(null)} />}

            <h1 className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Login
            </h1>

            <label htmlFor="email" className="block text-sm font-medium text-white">
                Email
            </label>
            <Input
                id="email"
                type="email"
                {...register("email", { required: "Email is required",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" } })}
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
                placeholder="Enter your password"
                autoComplete="current-password"
                className="border-white/25 bg-transparent text-white placeholder:text-zinc-300"
                error={errors.password?.message?.toString()}
            />
            <p className="text-center text-sm text-white/90">
                Don't have account?{" "}
                <Link to="/auth/signup" className="font-semibold text-white underline underline-offset-4">
                    Sign up
                </Link>
            </p>

            <Button type="submit" loading={isPending} className="w-full">
                Login
            </Button>

        </form>
    )
}