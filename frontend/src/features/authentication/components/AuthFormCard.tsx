import type { FormEventHandler, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../shared/ui/Button";

type AuthSwitchLink = {
    prompt: string;
    linkTo: string;
    linkLabel: string;
};

type AuthSubmit = {
    label: string;
    isPending: boolean;
};

type AuthFormCardProps = {
    title: string;
    subtitle: string;
    onSubmit: FormEventHandler<HTMLFormElement>;
    submit: AuthSubmit;
    switchLink: AuthSwitchLink;
    children: ReactNode;
};

const submitButtonClasses = [
    "mt-3 w-full cursor-pointer py-2.5 font-semibold",
    "bg-linear-to-r from-brand-primary via-brand-primary-strong to-brand-primary",
    "shadow-lg shadow-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/50",
    "disabled:hover:shadow-lg disabled:hover:shadow-brand-primary/30",
].join(" ");

export function AuthFormCard({ title, subtitle, onSubmit, submit, switchLink, children }: AuthFormCardProps) {
    return (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-dark-surface">
            <header>
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                    {title}
                </h1>
                <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                    {subtitle}
                </p>
            </header>

            <form onSubmit={onSubmit} className="mt-6 space-y-5">
                {children}

                <Button
                    type="submit"
                    loading={submit.isPending}
                    disabled={submit.isPending}
                    className={submitButtonClasses}
                >
                    {submit.label}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
                {switchLink.prompt}{" "}
                <Link
                    to={switchLink.linkTo}
                    className="rounded font-medium text-brand-primary-strong underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:text-indigo-300"
                >
                    {switchLink.linkLabel}
                </Link>
            </p>
        </section>
    );
}
