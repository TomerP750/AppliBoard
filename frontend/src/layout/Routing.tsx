import { Routes, Route } from "react-router-dom";
import { Home } from "../features/home/pages/Home";
import { DashboardLayout } from "../features/dashboard/layout/DashboardLayout";
import { DashboardIndex } from "../features/dashboard/index/pages/DashboardIndex";
import { ApplicationsPage } from "../features/dashboard/applications/pages/ApplicationsPage";


export function Routing() {
    return (
        <Routes>
            
            <Route path="/" element={<Home />}/>

            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardIndex />} />
                {/* <Route path="analytics" element={<AnalyticsPage />} /> */}
                <Route path="applications" element={<ApplicationsPage />} />
                {/* <Route path="settings" element={<SettingsPage />} /> */}
            </Route>


        </Routes>
    )
}