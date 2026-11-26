import { ChevronLeft, ChevronRight, LayoutDashboard, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../../shared/context/ThemeContext";
import { Badge } from "../../../../shared/ui/Badge";
import { useAuth } from "../../../authentication/contexts/AuthContext";
import { useSidebarCollapsed } from "../hooks/useSidebarCollapsed";
import { NavItemRow } from "./NavItemRow";
import { navItems } from "./navItems";

export function Sidebar() {

    const { user, logout } = useAuth();
    const { setTheme } = useTheme();
    const navigate = useNavigate();
    const { isCollapsed, toggleCollapsed } = useSidebarCollapsed();

    const handleLogout = async () => {
        await logout();
        navigate("/auth/login");
        setTheme("dark");
    }

    const toggleLabel = isCollapsed ? "Expand sidebar" : "Collapse sidebar";

    return (
        <aside
            className={`relative hidden h-screen shrink-0 border-r border-zinc-200 bg-white text-zinc-900 transition-[width] duration-200 md:block dark:border-white/10 dark:bg-dark-background dark:text-white ${isCollapsed ? "w-18" : "w-64"}`}
        >

            {/* Sits on the right border, half outside the sidebar. */}
            <button
                type="button"
                onClick={toggleCollapsed}
                aria-label={toggleLabel}
                aria-expanded={!isCollapsed}
                title={toggleLabel}
                className="absolute right-0 top-1/2 z-30 flex h-7 w-7 -translate-y-1/2 translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:bg-zinc-50 hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 dark:border-white/15 dark:bg-dark-surface dark:text-white/70 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
                {isCollapsed
                    ? <ChevronRight size={16} aria-hidden="true" />
                    : <ChevronLeft size={16} aria-hidden="true" />}
            </button>

            {/* Clips the content while the width animates; the toggle above stays outside the clip. */}
            <div className={`flex h-full flex-col overflow-hidden py-6 ${isCollapsed ? "px-3" : "px-5"}`}>

                {/* Brand */}
                <div className={`mb-8 flex ${isCollapsed ? "justify-center" : ""}`}>
                    {isCollapsed ? (
                        <LayoutDashboard size={22} strokeWidth={1.2} role="img" aria-label="AppliBoard" />
                    ) : (
                        <div className="min-w-0">
                            <h2 className="inline-flex items-center gap-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                                <LayoutDashboard size={20} strokeWidth={1.2} />
                                <span>AppliBoard</span>
                            </h2>
                            <p className="mt-1 truncate text-sm text-zinc-500 dark:text-white/40">
                                Job tracking dashboard
                            </p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1 flex-1">
                    {navItems.map((item) => (
                        <NavItemRow key={item.to} item={item} isCollapsed={isCollapsed} />
                    ))}
                </nav>

                {/* User section */}
                <div className="mt-6 border-t border-zinc-200 pt-4 dark:border-white/10">
                    <div className={`flex items-center ${isCollapsed ? "flex-col gap-2" : "justify-between"}`}>

                        {/* User badge */}
                        <div className="flex items-center gap-3 min-w-0">
                            <Badge
                                firstName={user?.firstName}
                                lastName={user?.lastName}
                                avatarUrl={user?.avatarUrl}
                                size="sm"
                                alt="User avatar"
                                title={isCollapsed ? user?.firstName ?? "Guest" : undefined} />

                            {!isCollapsed && (
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                                        {user ? `${user?.firstName}` : "Guest"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Logout */}
                        <button
                            className="cursor-pointer rounded-md p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950 dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
                            aria-label="Logout"
                            onClick={handleLogout}
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>

            </div>
        </aside>
    );
}
