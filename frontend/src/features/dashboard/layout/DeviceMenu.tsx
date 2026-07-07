import { navItems } from "./sidebar/navItems";
import { NavLink } from "react-router-dom";

export function DeviceMenu() {
    return (
        <nav className="z-50 block md:hidden fixed py-4
        bottom-0 left-0 right-0 
        bg-white dark:bg-dark-background w-screen">

            <ul className="min-w-0 grid grid-cols-4 text-zinc-900 dark:text-white">
                {navItems.map((ni) => {
                    const Icon = ni.icon;
                    return (
                        <li key={ni.to}>
                            <NavLink to={ni.to} className="flex flex-col items-center justify-center">
                                <Icon className="w-6 h-6" />
                                <span className="text-sm">{ni.label}</span>
                            </NavLink>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}