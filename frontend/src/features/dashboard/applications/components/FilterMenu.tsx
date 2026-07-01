export type FilterValue = "favorites" | "in-progress" | "recent";

type FilterMenuProps = {
    selectedFilter: FilterValue | null;
    onSelectFilter: (filter: FilterValue) => void;
};

const baseButtonClassName =
    "w-full rounded-lg px-3 py-2 text-left text-sm transition dark:text-zinc-200 dark:hover:bg-zinc-800";

const filterOptions: { value: FilterValue; label: string }[] = [
    { value: "favorites", label: "Favorites first" },
    { value: "in-progress", label: "Only in progress" },
    { value: "recent", label: "Recently applied" },
];

export function FilterMenu({ selectedFilter, onSelectFilter }: FilterMenuProps) {
    
    return (
        <div className="w-52 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            {filterOptions.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    className={`${baseButtonClassName} ${
                        selectedFilter === option.value
                            ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                            : "text-zinc-700 hover:bg-zinc-100"
                    }`}
                    onClick={() => onSelectFilter(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
