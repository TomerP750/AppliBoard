import { NoteType, type AiSummaryResponse } from "../models/AiSummaryResponse";

export const dummyAiSummary: AiSummaryResponse = {
    summaryParagraph:
        "You made steady progress this month, with stronger consistency and improved response quality. Personalized applications performed best, especially those sent during the middle of the week. Your next opportunity is to follow up with employers more consistently and continue prioritizing roles that closely match your experience.",
    notes: [
        {
            type: NoteType.STRENGTH,
            content: "Your application activity increased and remained consistent throughout the month.",
        },
        {
            type: NoteType.OPPORTUNITY,
            content: "Applications with personalized notes received more positive responses.",
        },
        {
            type: NoteType.CONCERN,
            content: "Several pending applications have not received a follow-up after five business days.",
        },
    ],
};
