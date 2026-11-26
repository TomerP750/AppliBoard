import type { NavItem } from "./navItems";
import { NavLink } from "react-router-dom";

interface NavItemRowProps {
    item: NavItem;
    isCollapsed: boolean;
}
export function NavItemRow({ item, isCollapsed }: NavItemRowProps) {

    const Icon = item.icon;

    return (
        <NavLink
            key={item.to}
            to={item.to}
            end={item.end ?? true}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }) =>
                `group relative flex items-center rounded-lg py-2 text-sm font-medium transition ${isCollapsed ? "justify-center px-2" : "px-3"} ${isActive
                    ? "before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-brand-primary bg-zinc-100 text-zinc-950 dark:bg-white/10 dark:text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
                }`
            }
        >
            <div className={`flex items-center gap-3 ${isCollapsed ? "" : "w-full"}`}>
                <Icon size={18} className="shrink-0" aria-hidden="true" />

                <span className={isCollapsed ? "sr-only" : "truncate"}>
                    {item.label}
                </span>

                {item.hasUpdates && (
                    <div
                        title="New Summary Available"
                        className={`h-2 w-2 rounded-full bg-brand-primary ${isCollapsed ? "absolute right-1.5 top-1.5" : "ml-auto"}`}
                    />
                )}
            </div>
        </NavLink>
    );
}
