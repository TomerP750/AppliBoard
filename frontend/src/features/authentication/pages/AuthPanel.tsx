import { LayoutDashboard } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";


export function AuthPanel() {

    return (
        <main className="relative min-h-screen overflow-hidden bg-zinc-50 px-4 py-6 sm:px-6 lg:px-10 dark:bg-dark-background">

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--color-brand-primary)_14%,transparent),transparent_40%),radial-gradient(circle_at_bottom_right,color-mix(in_oklab,var(--color-brand-secondary)_10%,transparent),transparent_40%)] dark:bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--color-brand-primary)_22%,transparent),transparent_35%),radial-gradient(circle_at_bottom_right,color-mix(in_oklab,var(--color-brand-secondary)_14%,transparent),transparent_35%)]"
            />

            <div className="relative z-10">
                <NavLink
                    to="/"
                    className="inline-flex items-center gap-2.5 rounded-lg text-xl font-semibold tracking-tight text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 md:text-2xl dark:text-white"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary-strong text-white">
                        <LayoutDashboard size={18} aria-hidden="true" />
                    </span>
                    AppliBoard
                </NavLink>
            </div>

            <div className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-md items-center justify-center py-8">
                <div className="w-full">
                    <Outlet />
                </div>
            </div>

        </main>
    )

}
