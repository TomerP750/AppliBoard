import { BarChart3, Briefcase, Home, Settings, WandSparkles, type LucideIcon } from "lucide-react";

export type NavItem = {
    label: string;
    to: string;
    icon: LucideIcon;
    hasUpdates?: boolean;
    /** Set to false for items whose route has children, so they stay active on nested paths. */
    end?: boolean;
};


export const navItems: NavItem[] = [
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
        label: "AI Summary",
        to: "/dashboard/ai-summary",
        icon: WandSparkles,
        hasUpdates: true,
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
        end: false,
    },
];