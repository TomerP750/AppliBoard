import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { ApiErrorResponse } from "../../../shared/models/ApiErrorResponse";
import { Input } from "../../../shared/ui/Input";
import { AuthFormCard } from "../components/AuthFormCard";
import { AUTH_INPUT_CLASS_NAME } from "../utils/authStyles";
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
        <AuthFormCard
            title="Welcome back"
            subtitle="Sign in to keep track of your applications."
            onSubmit={handleSubmit(handleLogin)}
            submit={{ label: "Sign in", isPending }}
            switchLink={{ prompt: "Don't have an account?", linkTo: "/auth/signup", linkLabel: "Sign up" }}
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
                    className={AUTH_INPUT_CLASS_NAME}
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
                    className={AUTH_INPUT_CLASS_NAME}
                    error={errors.password?.message?.toString()}
                />
        </AuthFormCard>
    )
}