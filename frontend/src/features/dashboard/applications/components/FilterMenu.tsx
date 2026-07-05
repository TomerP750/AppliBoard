import { Check, RotateCcw, SlidersHorizontal, StarIcon } from "lucide-react";
import { toTitleCase } from "../../../../shared/util/toTitleCase";
import { Position } from "../models/Position";
import { Status } from "../models/Status";
import { Switch } from "../../../../shared/ui/Switch";
import { Button } from "../../../../shared/ui/Button";

const filterChipClassName =
    "rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-brand-primary/50 hover:bg-brand-primary/5 hover:text-brand-primary dark:border-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-200 dark:hover:border-brand-primary/60 dark:hover:bg-brand-primary/10";
const activeFilterChipClassName =
    "rounded-full border border-brand-primary bg-brand-primary/10 px-3 py-1.5 text-xs font-semibold text-brand-primary ring-1 ring-brand-primary/30 transition dark:border-brand-primary/70 dark:bg-brand-primary/15 dark:text-brand-primary";

const statusToneClassNames: Record<Status, string> = {
    [Status.ACCEPTED]: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900",
    [Status.REJECTED]: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900",
    [Status.IN_PROGRESS]: "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900",
    [Status.PENDING]: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900",
};

interface FilterMenuProps {
    showFavoritesOnly: boolean;
    selectedStatuses: Status[];
    selectedPositions: Position[];
    onShowFavoritesOnlyChange: (checked: boolean) => void;
    onResetFilters: () => void;
    onApplyFilters: () => void;
    onAddStatusFilter: (status: Status) => void;
    onAddPositionFilter: (position: Position) => void;
    onClose: () => void;
}

export function FilterMenu({ showFavoritesOnly, 
    selectedStatuses,
    selectedPositions,
    onShowFavoritesOnlyChange, 
    onResetFilters, 
    onApplyFilters,
    onAddStatusFilter,
    onAddPositionFilter,
    onClose,
}: FilterMenuProps) {

    const handleResetFilters = () => {
        onResetFilters();
        onClose();
    }

    return (
        <div className="w-100 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/60 ring-1 ring-black/5 dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/30 dark:ring-white/10">

            <header className="border-b border-zinc-100 bg-gradient-to-br from-zinc-50 to-white px-4 py-3 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-900">
                <p className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    <SlidersHorizontal size={16} className="text-white" />
                    Filter Applications
                </p>
            </header>

            <div className="space-y-5 p-4">
                <div
                    className="flex w-full items-center justify-between bg-zinc-50 px-3 py-3 text-left dark:bg-zinc-900"
                >
                    <div className="flex items-center gap-3">
                        <StarIcon size={17} className="text-yellow-500 fill-current" />
                        <span>
                            <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                Show Favorites Only
                            </span>
                            <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                                Focus on saved opportunities
                            </span>
                        </span>
                    </div>

                    {/* Switch */}
                    <Switch
                        checked={showFavoritesOnly}
                        onCheckedChange={onShowFavoritesOnlyChange}
                    />

                </div>

                <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Roles
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {Object.values(Position).map((position) => {
                            const selected = selectedPositions.includes(position);

                            return (
                                <button key={position}
                                    type="button"
                                    aria-pressed={selected}
                                    className={selected ? activeFilterChipClassName : filterChipClassName}
                                    onClick={() => onAddPositionFilter(position)}
                                >
                                    {toTitleCase(position)}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Statuses
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.values(Status).map((status) => {
                            const selected = selectedStatuses.includes(status);

                            return (
                                <button
                                    key={status}
                                    type="button"
                                    aria-pressed={selected}
                                    className={`inline-flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold ring-1 transition hover:scale-[1.01] ${selected ? "scale-[1.01] ring-2 ring-brand-primary" : ""} ${statusToneClassNames[status]}`}
                                    onClick={() => onAddStatusFilter(status)}
                                >
                                    {toTitleCase(status)}
                                    <Check size={14} className={selected ? "opacity-100" : "opacity-40"} />
                                </button>
                            );
                        })}
                    </div>
                </div>

            </div>

            <div className="flex items-center justify-between gap-3 border-t border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/70">
                <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<RotateCcw size={15} />}
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                    Reset
                </Button>
                <Button
                    onClick={onApplyFilters}
                    className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-primary/20 transition hover:bg-brand-primary/90"
                >
                    Apply Filters
                </Button>
            </div>
        </div>
    );
}
