import { Routes, Route } from "react-router-dom";
import { Home } from "../features/home/pages/Home";
import { DashboardLayout } from "../features/dashboard/layout/DashboardLayout";
import { DashboardIndex } from "../features/dashboard/index/pages/DashboardIndex";
import { ApplicationsPage } from "../features/dashboard/applications/pages/ApplicationsPage";
import { AnalyticsPage } from "../features/dashboard/analytics/pages/AnalyticsPage";
import { SettingsPage } from "../features/dashboard/settings/pages/SettingsPage";
import { LoginPage } from "../features/authentication/pages/LoginPage";
import { SignupPage } from "../features/authentication/pages/SignupPage";
import { AuthPanel } from "../features/authentication/pages/AuthPanel";


export function Routing() {
    return (
        <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPanel />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
            </Route>


            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardIndex />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="applications" element={<ApplicationsPage />} />
                <Route path="settings" element={<SettingsPage />} />
            </Route>


        </Routes>
    )
}