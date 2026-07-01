import { SettingsIcon } from "lucide-react";
import { ChangePasswordForm } from "../components/ChangePasswordForm";
import { PersonalDetailsForm } from "../components/PersonalDetailsForm";
import { DashboardHeader } from "../../layout/DashboardHeader";
import { DeleteAccount } from "../components/DeleteAccount";


export function SettingsPage() {

    return (
        <section className="min-h-screen bg-zinc-50 p-4 sm:p-6 dark:bg-dark-background">
            <DashboardHeader Icon={SettingsIcon} title={"Settings"} />

            <div className="mt-8 flex max-w-4xl flex-col gap-6">
                
                <PersonalDetailsForm />

                <ChangePasswordForm />

                <DeleteAccount />
                
            </div>
            
        </section>
    )
}