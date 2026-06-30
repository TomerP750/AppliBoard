import { SettingsIcon } from "lucide-react";
import { ChangePasswordForm } from "../components/ChangePasswordForm";
import { PersonalDetailsForm } from "../components/PersonalDetailsForm";
import { DashboardHeader } from "../../layout/DashboardHeader";


export function SettingsPage() {
    return (
        <section className="min-h-screen bg-zinc-50 p-4 sm:p-6 dark:bg-dark-background">
            <DashboardHeader Icon={SettingsIcon} title={"Settings"} />

            <div className="mt-8 flex max-w-4xl flex-col gap-6">
                
                <PersonalDetailsForm />
                <ChangePasswordForm />

                <section className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm dark:border-red-900/60 dark:bg-red-950/20 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">
                                Delete Account
                            </h2>
                            <p className="mt-1 text-sm text-red-600/80 dark:text-red-300/80">
                                Permanently delete your account and all related data.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                        >
                            Delete Account
                        </button>
                    </div>
                </section>
            </div>
        </section>
    )
}