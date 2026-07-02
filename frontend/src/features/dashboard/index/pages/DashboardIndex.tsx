import { BarChart3, FileText, Settings, Sparkles } from "lucide-react";
import { DashboardHeader } from "../../layout/DashboardHeader";
import { ActionButton } from "../components/ActionButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../authentication/contexts/AuthContext";


export function DashboardIndex() {

    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <section className="min-h-screen p-6 bg-gray-100 dark:bg-dark-background">

            <DashboardHeader title={`Welcome ${user?.firstName} ${user?.lastName}`} Icon={Sparkles} />

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-10">

                <ActionButton
                    title="Applications"
                    Icon={FileText}
                    onClick={() => navigate("/dashboard/applications")}
                />

                <ActionButton
                    title="Analytics"
                    Icon={BarChart3}
                    onClick={() => navigate("/dashboard/analytics")}
                />

                <ActionButton
                    title="Settings"
                    Icon={Settings}
                    onClick={() => navigate("/dashboard/settings")}
                />

            </div>

        </section>
    )
}