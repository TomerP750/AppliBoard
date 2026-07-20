import { SettingsIcon } from "lucide-react";
import { DashboardHeader } from "../../layout/dashboard_header/DashboardHeader";
import { NavLink, Outlet } from "react-router-dom";


const linkClasses = "focus:outline-none! focus:ring-0! relative inline-flex shrink-0 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 dark:text-zinc-400 dark:hover:text-white";


const getLinkClasses = ({ isActive }: { isActive: boolean }) => [
    linkClasses,
    isActive
        ? "dark:text-white! after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-brand-primary dark:text-white"
        : "",
]
    .filter(Boolean)
    .join(" ");


export default function SettingsPage() {

    return (

        <section className="min-h-screen bg-zinc-50 p-6 pb-24 md:pb-6 dark:bg-dark-background">
            <DashboardHeader Icon={SettingsIcon} title={"Settings"} />

            <div className="mt-8 flex max-w-4xl flex-col gap-6">

                <nav
                    aria-label="Settings sections"
                    className="flex gap-2 overflow-x-auto pb-2"
                >
                    <NavLink to="display" className={getLinkClasses}>
                        Display
                    </NavLink>
                    <NavLink to="personal-details" className={getLinkClasses}>
                        Personal Details
                    </NavLink>
                    <NavLink to="change-password" className={getLinkClasses}>
                        Change Password
                    </NavLink>
                    <NavLink to="delete-account" className={getLinkClasses}>
                        Delete Account
                    </NavLink>
                </nav>

                <Outlet />

            </div>

        </section>
    )
}