import { Home, Briefcase, BarChart3, Settings } from "lucide-react";

export const navItems = [
    {
        label: "Home",
        to: "/dashboard",
        icon: Home,
    },
    {
        label: "Applications",
        to: "/dashboard/applications",
        icon: Briefcase,
    },
    {
        label: "Analytics",
        to: "/dashboard/analytics",
        icon: BarChart3,
    },
    {
        label: "Settings",
        to: "/dashboard/settings",
        icon: Settings,
    },
];