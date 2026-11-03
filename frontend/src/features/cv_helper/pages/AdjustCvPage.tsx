import { CvWorkspace } from "../components/CvWorkspace";
import { CvUploadCard } from "../components/CvUploadCard";
import { JobDescriptionCard } from "../components/JobDescriptionCard";
import { CvAdjustmentOptions } from "../components/CvAdjustmentOptions";

export default function AdjustCvPage() {
    return (
        <CvWorkspace title="Adjust your existing CV" description="Add your CV, paste the job description, and choose your column layout.">
            <div className="space-y-5">
                <div className="grid gap-8 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/60 md:grid-cols-2 sm:p-6 lg:gap-10">
                    <CvUploadCard />
                    <JobDescriptionCard />
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/60 sm:p-6">
                    <CvAdjustmentOptions />
                </div>
            </div>
        </CvWorkspace>
    );
}
