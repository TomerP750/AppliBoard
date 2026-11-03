import type { ReactNode } from "react";
import { ArrowLeft, Notebook } from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardHeader } from "../../dashboard/layout/dashboard_header/DashboardHeader";

type CvWorkspaceProps = {
    title: string;
    description: string;
    children: ReactNode;
};

export function CvWorkspace({ title, description, children }: CvWorkspaceProps) {
    return (
        <section className="min-h-screen bg-zinc-50 p-4 pb-28 dark:bg-dark-background sm:p-6 md:pb-8 lg:p-8">
            <DashboardHeader Icon={Notebook} title="CV Helper" />
            <div className="mx-auto mt-6 max-w-6xl space-y-6 sm:mt-8">
                <div>
                    <Link to="/dashboard/cv-helper" className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-zinc-600 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500 dark:text-zinc-400 dark:hover:text-indigo-300">
                        <ArrowLeft aria-hidden="true" className="size-4" /> All CV tools
                    </Link>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl"><span className="bg-linear-to-r from-indigo-700 to-sky-700 bg-clip-text text-transparent dark:from-indigo-300 dark:to-sky-300 forced-colors:bg-none forced-colors:text-[CanvasText]">{title}</span></h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">{description}</p>
                </div>
                {children}
            </div>
        </section>
    );
}
