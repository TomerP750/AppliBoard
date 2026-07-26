import type { NavItem } from "./navItems";
import { NavLink } from "react-router-dom";

interface NavItemRowProps {
    item: NavItem;
}
export function NavItemRow({ item }: NavItemRowProps) {

    const Icon = item.icon;

    return (
        <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
                `group flex items-center px-3 py-2 rounded-lg transition text-sm font-medium ${isActive
                    ? "relative before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-brand-primary bg-zinc-100 text-zinc-950 dark:bg-white/10 dark:text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
                }`
            }
        >
            <div className="flex items-center gap-3 w-full">
                <Icon size={18} className="shrink-0" />

                <span className="truncate">
                    {item.label}
                </span>

                {item.hasUpdates && (
                    <div className="ml-auto w-2 h-2 bg-brand-primary rounded-full" />
                )}
            </div>
        </NavLink>
    );
}