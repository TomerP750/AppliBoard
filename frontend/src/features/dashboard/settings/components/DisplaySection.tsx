

import { useState } from "react"

export function DisplaySection() {
    const [theme, setTheme] = useState("system")

    return (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 sm:p-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Display
            </h2>
            <div className="mt-4 flex flex-col gap-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center gap-5">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                        Theme
                    </span>
                    <select
                        value={theme}
                        onChange={(event) => setTheme(event.target.value)}
                        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                    </select>
                </div>
            </div>
        </section>
    )
}