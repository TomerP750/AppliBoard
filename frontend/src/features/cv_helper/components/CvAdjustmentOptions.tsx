import { useId, useState } from "react";
import { AlignJustify, Check, Columns2 } from "lucide-react";
import { CvColumnLayout } from "../models/CvColumnLayout";

const layouts = [
    { value: CvColumnLayout.SINGLE_COLUMN, label: "Single column", Icon: AlignJustify },
    { value: CvColumnLayout.SPLIT_COLUMN, label: "Split column", Icon: Columns2 },
];

export function CvAdjustmentOptions() {
    const groupName = useId();
    const [layout, setLayout] = useState<CvColumnLayout>(CvColumnLayout.SINGLE_COLUMN);

    return (
        <fieldset className="min-w-0">
            <legend className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Column layout</legend>
            <div className="mt-4 grid max-w-xl gap-4 sm:grid-cols-2">
                {layouts.map(({ value, label, Icon }) => (
                    <label key={value} className="flex cursor-pointer flex-col gap-4 rounded-lg border border-zinc-400 p-4 text-sm font-medium text-zinc-700 transition-colors hover:border-brand-primary has-checked:border-brand-primary has-checked:bg-indigo-50 has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-indigo-500 dark:border-zinc-500 dark:text-zinc-200 dark:hover:border-indigo-400 dark:has-checked:border-indigo-400 dark:has-checked:bg-indigo-500/10">
                        <input
                            type="radio"
                            name={groupName}
                            value={value}
                            checked={layout === value}
                            onChange={() => setLayout(value)}
                            className="sr-only"
                        />
                        <Icon aria-hidden="true" strokeWidth={1.25} className="size-10 text-zinc-600 dark:text-zinc-300" />
                        <span className="flex items-center justify-between gap-3">
                            <span>{label}</span>
                            {layout === value && <Check aria-hidden="true" className="size-5 shrink-0 text-indigo-600 dark:text-indigo-300" />}
                        </span>
                    </label>
                ))}
            </div>
        </fieldset>
    );
}
