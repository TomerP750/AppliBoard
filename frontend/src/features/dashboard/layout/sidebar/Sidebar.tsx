import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut } from "lucide-react";
import { navItems } from "./navItems";
import { useAuth } from "../../../authentication/contexts/AuthContext";
import { Badge } from "../../../../shared/ui/Badge";
import { useTheme } from "../../../../shared/context/ThemeContext";

export function Sidebar() {

    const { user, logout } = useAuth();
    const { setTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/auth/login");
        setTheme("dark");
    }

    return (
        <aside className="hidden md:flex h-screen w-64 flex-col border-r border-zinc-200 bg-white px-5 py-6 text-zinc-900 dark:border-white/10 dark:bg-dark-background dark:text-white">

            {/* Brand */}
            <div className="mb-8">
                <h2 className="inline-flex items-center gap-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                    <LayoutDashboard size={20} strokeWidth={1.2} />
                    <span>AppliBoard</span>
                </h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-white/40">
                    Job tracking dashboard
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 flex-1">
                {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end
                            // Add purple bar in the left when active
                            className={({ isActive }) =>
                                `group flex items-center gap-3 px-3 py-2 rounded-lg transition text-sm font-medium ${
                                    isActive
                                        ? "relative before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-brand-primary bg-zinc-100 text-zinc-950 dark:bg-white/10 dark:text-white"
                                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
                                }`
                            }
                        >
                            <Icon size={18} className="shrink-0" />
                            <span className="truncate">{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* User section */}
            <div className="mt-6 border-t border-zinc-200 pt-4 dark:border-white/10">
                <div className="flex items-center justify-between">
                    
                    {/* User badge */}
                    <div className="flex items-center gap-3 min-w-0">
                        <Badge 
                        firstName={user?.firstName}
                        lastName={user?.lastName}
                        avatarUrl={user?.avatarUrl} 
                        size="sm" 
                        alt="User avatar" />

                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                                {user ? `${user?.firstName}` : "Guest"}
                            </p>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        className="cursor-pointer rounded-md p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950 dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
                        aria-label="Logout"
                        onClick={handleLogout}
                    >
                        <LogOut size={18}/>
                    </button>
                </div>
            </div>

        </aside>
    );
}