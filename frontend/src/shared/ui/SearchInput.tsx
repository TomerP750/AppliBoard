import type { LucideIcon } from "lucide-react";
import { Search } from "lucide-react";
import { Input, type InputProps } from "./Input";

export type SearchInputProps = Omit<InputProps, "type"> & {
    icon?: LucideIcon;
};

export function SearchInput({
    icon: Icon = Search,
    className = "",
    placeholder = "Search...",
    ...props
}: SearchInputProps) {
    return (
        <div className="relative w-full">
            <Icon
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
            />
            <Input
                type="search"
                className={`pl-9 ${className}`.trim()}
                placeholder={placeholder}
                {...props}
            />
        </div>
    );
}
