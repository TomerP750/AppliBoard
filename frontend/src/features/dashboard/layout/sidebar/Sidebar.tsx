import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { navItems } from "./navItems";

export function Sidebar() {
    return (
        <aside className="hidden md:flex h-screen w-64 flex-col border-r border-white/10 bg-zinc-950 text-white px-5 py-6">

            {/* Brand */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold tracking-tight text-white">
                    AppliBoard
                </h2>
                <p className="text-xs text-white/40 mt-1">
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
                            className={({ isActive }) =>
                                `group flex items-center gap-3 px-3 py-2 rounded-lg transition text-sm font-medium ${
                                    isActive
                                        ? "bg-white/10 text-white"
                                        : "text-white/60 hover:text-white hover:bg-white/5"
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
            <div className="mt-6 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                    
                    {/* User badge */}
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold">
                            T
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                Tomer
                            </p>
                            <p className="text-xs text-white/40 truncate">
                                Pro Plan
                            </p>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        className="p-2 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition"
                        aria-label="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>

        </aside>
    );
}