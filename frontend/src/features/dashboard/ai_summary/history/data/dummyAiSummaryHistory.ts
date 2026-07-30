import { NoteType, SummaryTrend } from "../../current/models/AiSummaryResponse";
import type { AiSummaryHistoryItem } from "../models/AiSummaryHistoryItem";

export const dummyAiSummaryHistory: AiSummaryHistoryItem[] = [
    {
        id: "summary-june-2026",
        month: "June",
        year: 2026,
        generatedAt: "June 30, 2026",
        summaryParagraph:
            "June was a productive month with consistent application activity and a stronger response rate. Your best results came from roles closely aligned with your recent experience, while older pending applications would benefit from timely follow-ups.",
        notes: [
            { type: NoteType.STRENGTH, content: "Your response rate improved compared with May." },
            { type: NoteType.OPPORTUNITY, content: "Prioritize roles matching your recent experience." },
            { type: NoteType.CONCERN, content: "Four applications remained pending without follow-up." },
        ],
        trend: SummaryTrend.UP,
    },
    {
        id: "summary-may-2026",
        month: "May",
        year: 2026,
        generatedAt: "May 31, 2026",
        summaryParagraph:
            "You increased the number of tailored applications in May and began seeing more recruiter engagement. Maintaining a steadier weekly rhythm could help turn that improved quality into more interviews.",
        notes: [
            { type: NoteType.STRENGTH, content: "More applications included personalized notes." },
            { type: NoteType.OPPORTUNITY, content: "Spread applications more evenly across each week." },
        ],
        trend: SummaryTrend.NEUTRAL,
    },
    {
        id: "summary-april-2026",
        month: "April",
        year: 2026,
        generatedAt: "April 30, 2026",
        summaryParagraph:
            "April established a useful baseline for your search. You explored a broad range of roles, but focusing on a smaller set of relevant positions and following up consistently would improve your chances of receiving a response.",
        notes: [
            { type: NoteType.STRENGTH, content: "You established a consistent application-tracking habit." },
            { type: NoteType.OPPORTUNITY, content: "Narrow your search to the most relevant roles." },
            { type: NoteType.CONCERN, content: "The application-to-response ratio was below your target." },
        ],
        trend: SummaryTrend.DOWN,
    },
];
