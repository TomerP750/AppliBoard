import { Navigate, Routes, Route } from "react-router-dom";
import { Home } from "../features/home/pages/Home";
import { DashboardLayout } from "../features/dashboard/layout/DashboardLayout";
import { LoginPage } from "../features/authentication/pages/LoginPage";
import { SignupPage } from "../features/authentication/pages/SignupPage";
import { AuthPanel } from "../features/authentication/pages/AuthPanel";
import { lazy, Suspense } from "react";
import { NotFoundPage } from "../shared/pages/NotFoundPage";
import { DisplaySection } from "../features/dashboard/settings/components/DisplaySection";
import { PersonalDetailsForm } from "../features/dashboard/settings/components/PersonalDetailsForm";
import { ChangePasswordForm } from "../features/dashboard/settings/components/ChangePasswordForm";
import { DeleteAccount } from "../features/dashboard/settings/components/DeleteAccount";

const AnalyticsPage = lazy(() => import("../features/dashboard/analytics/pages/AnalyticsPage"));
const SettingsPage = lazy(() => import("../features/dashboard/settings/pages/SettingsPage"));
const ApplicationsPage = lazy(() => import("../features/dashboard/applications/pages/ApplicationsPage"));
const DashboardIndex = lazy(() => import("../features/dashboard/index/pages/DashboardIndex"));

export function Routing() {
    return (
        <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPanel />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
            </Route>


            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={ <SuspenseWrapper><DashboardIndex /></SuspenseWrapper> }/>
                <Route path="analytics" element={ <SuspenseWrapper><AnalyticsPage /></SuspenseWrapper> }/>
                <Route path="applications" element={ <SuspenseWrapper><ApplicationsPage /></SuspenseWrapper> }/>
                <Route path="settings" element={ <SuspenseWrapper><SettingsPage /></SuspenseWrapper> }>
                    <Route index element={<Navigate to="display" replace />} />
                    <Route path="display" element={<DisplaySection />} />
                    <Route path="personal-details" element={<PersonalDetailsForm />} />
                    <Route path="change-password" element={<ChangePasswordForm />} />
                    <Route path="delete-account" element={<DeleteAccount />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />

        </Routes>
    )
}

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            {children}
        </Suspense>
    )
}