import { useEffect, useMemo, type ChangeEvent } from "react";
import type { LucideIcon } from "lucide-react";
import { Search } from "lucide-react";
import { Input, type InputProps } from "./Input";
import { debounce } from "lodash";

export type SearchInputProps = Omit<InputProps, "type"> & {
    onAfterSearch?: (searchValue: string) => void;
    icon?: LucideIcon;
};

export function SearchInput({
    onAfterSearch,
    icon: Icon = Search,
    className = "",
    placeholder = "Search...",
    onChange,
    ...props
}: SearchInputProps) {
    const debouncedAfterSearch = useMemo(
        () => debounce((searchValue: string) => onAfterSearch?.(searchValue), 2500),
        [onAfterSearch],
    );

    useEffect(() => {
        return () => debouncedAfterSearch.cancel();
    }, [debouncedAfterSearch]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange?.(event);
        debouncedAfterSearch(event.target.value);
    };

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
                onChange={handleChange}
                {...props}
            />
        </div>
    );
}
