import { BarChart3, FileText, Settings, Sparkles } from "lucide-react";
import { DashboardHeader } from "../../layout/DashboardHeader";
import { ActionButton } from "../components/ActionButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../authentication/contexts/AuthContext";
import { ActivitySection } from "../components/ActivitySection";


export function DashboardIndex() {

    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <section className="min-h-screen p-6 bg-gray-100 dark:bg-dark-background">

            <DashboardHeader title={`Welcome ${user?.firstName} ${user?.lastName}`} Icon={Sparkles} />

            <div className="py-10">
                <h2 className="text-xl font-medium dark:text-white">Quick Actions</h2>
                {/* Action Buttons */}
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">

                    <ActionButton
                        color="indigo"
                        title="Applications"
                        description="View all your applications"
                        Icon={FileText}
                        onClick={() => navigate("/dashboard/applications")}
                    />

                    <ActionButton
                        color="emerald"
                        title="Analytics"
                        description="View your application analytics"
                        Icon={BarChart3}
                        onClick={() => navigate("/dashboard/analytics")}
                    />

                    <ActionButton
                        color="sky"
                        title="Settings"
                        description="Manage your settings"
                        Icon={Settings}
                        onClick={() => navigate("/dashboard/settings")}
                    />

                </div>

                <ActivitySection />
            </div>

        </section>
    )
}