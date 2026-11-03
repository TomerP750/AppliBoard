import { FilePlus2, Notebook, SlidersHorizontal } from "lucide-react";
import { DashboardHeader } from "../../dashboard/layout/dashboard_header/DashboardHeader";
import { CvHelperIntro } from "../components/CvHelperIntro";
import { CvToolCard } from "../components/CvToolCard";

export default function CvHelperPage() {
    return (
        <section className="min-h-screen bg-zinc-50 p-4 pb-28 dark:bg-dark-background sm:p-6 md:pb-8 lg:p-8">
            <DashboardHeader Icon={Notebook} title="CV Helper" />
            <div className="mx-auto mt-8 max-w-6xl space-y-6">
                <CvHelperIntro />
                <nav aria-label="CV tools" className="grid gap-5 md:grid-cols-2">
                    <CvToolCard to="/dashboard/cv-helper/create" Icon={FilePlus2} title="Create a new CV" description="Start a new version of your CV with a draft and the role you have in mind." action="Create a CV" />
                    <CvToolCard to="/dashboard/cv-helper/adjust" Icon={SlidersHorizontal} title="Adjust your existing CV" description="Refine your current CV, highlight your strengths, and tailor the details to your next opportunity." action="Adjust my CV" />
                </nav>
            </div>
        </section>
    );
}
