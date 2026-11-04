import { CvWorkspace } from "../components/CvWorkspace";
import { CvUploadCard } from "../components/CvUploadCard";
import { JobDescriptionCard } from "../components/JobDescriptionCard";
import { CvReviewPreview } from "../components/CvReviewPreview";

export default function CreateCvPage() {
    return (
        <CvWorkspace title="Create a new CV" description="Choose a draft to start from and add the job description for your next application.">
            <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="grid gap-8 p-5 md:grid-cols-2 sm:p-6 lg:gap-10">
                    <CvUploadCard />
                    <JobDescriptionCard />
                </div>
                <div className="border-t border-zinc-200 p-5 dark:border-zinc-800 sm:p-6">
                    <CvReviewPreview />
                </div>
            </div>
        </CvWorkspace>
    );
}
