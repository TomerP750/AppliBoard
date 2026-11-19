import { WandSparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "../../../layout/dashboard_header/DashboardHeader";
import { useCurrentWeeklyReview, useGenerateWeeklyReview } from "../../hooks/useWeeklyReview";
import { ReviewLoadError, ReviewLoading } from "../../shared/components/ReviewQueryStates";
import { AnalysisSummary } from "../components/AnalysisSummary";
import { WeeklyReviewHero } from "../components/WeeklyReviewHero";

export function AiSummaryPage() {
    const navigate = useNavigate();
    const { data: reviewStatus, isLoading, isError, refetch } = useCurrentWeeklyReview();
    const { generateReview, isGenerating } = useGenerateWeeklyReview();

    return (
        <section className="min-h-screen bg-zinc-100 p-4 pb-28 dark:bg-dark-background sm:p-6 md:pb-8 lg:p-8">
            <DashboardHeader Icon={WandSparkles} title="Weekly Review" />

            <main className="mx-auto mt-8 max-w-5xl space-y-5 sm:mt-10 sm:space-y-6">
                {isLoading && <ReviewLoading label="Loading your weekly review..." />}

                {isError && !reviewStatus && (
                    <ReviewLoadError message="Couldn't load your weekly review." onRetry={() => refetch()} />
                )}

                {reviewStatus && (
                    <>
                        <WeeklyReviewHero
                            weekStart={reviewStatus.weekStart}
                            weekEnd={reviewStatus.weekEnd}
                            canGenerate={reviewStatus.canGenerate}
                            nextAvailableAt={reviewStatus.nextAvailableAt}
                            isGenerating={isGenerating}
                            onGenerate={() => generateReview()}
                            onViewHistory={() => navigate("/dashboard/ai-summary/history")}
                        />

                        {isGenerating
                            ? <ReviewLoading label="Analyzing last week. This can take a few seconds..." />
                            : <AnalysisSummary review={reviewStatus.review} />}
                    </>
                )}
            </main>
        </section>
    );
}
