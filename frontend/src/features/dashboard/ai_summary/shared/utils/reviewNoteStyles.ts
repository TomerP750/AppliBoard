import { CheckCircle2, Info, Lightbulb, type LucideIcon } from "lucide-react";
import { ReviewNoteType } from "../../current/models/ReviewNoteType";

export type ReviewNoteStyle = {
    label: string;
    pluralLabel: string;
    /** What this kind of note is about, shown before a review exists. */
    description: string;
    icon: LucideIcon;
    container: string;
    iconStyle: string;
    labelStyle: string;
    chip: string;
    dot: string;
};

/** Single source of truth for how each note type looks across the current review, empty state and history. */
export const reviewNoteStyles: Record<ReviewNoteType, ReviewNoteStyle> = {
    [ReviewNoteType.GOOD]: {
        label: "Good",
        pluralLabel: "Good",
        description: "What you kept up well this week.",
        icon: CheckCircle2,
        container: "border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10",
        iconStyle: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
        labelStyle: "text-emerald-700 dark:text-emerald-300",
        chip: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
        dot: "bg-emerald-500",
    },
    [ReviewNoteType.NEUTRAL]: {
        label: "Neutral",
        pluralLabel: "Neutral",
        description: "Plain observations about your rhythm.",
        icon: Info,
        container: "border-sky-200 bg-sky-50 dark:border-sky-500/20 dark:bg-sky-500/10",
        iconStyle: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
        labelStyle: "text-sky-700 dark:text-sky-300",
        chip: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
        dot: "bg-sky-500",
    },
    [ReviewNoteType.IMPROVE]: {
        label: "Improve",
        pluralLabel: "To improve",
        description: "One concrete step for next week.",
        icon: Lightbulb,
        container: "border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10",
        iconStyle: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
        labelStyle: "text-amber-700 dark:text-amber-300",
        chip: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
        dot: "bg-amber-500",
    },
};

export const REVIEW_NOTE_TYPES: ReviewNoteType[] = [
    ReviewNoteType.GOOD,
    ReviewNoteType.NEUTRAL,
    ReviewNoteType.IMPROVE,
];
