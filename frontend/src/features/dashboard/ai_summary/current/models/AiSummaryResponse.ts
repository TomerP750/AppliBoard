export enum NoteType {
    STRENGTH = "STRENGTH",
    OPPORTUNITY = "OPPORTUNITY",
    CONCERN = "CONCERN",
}

export enum SummaryTrend {
    UP = "UP",
    DOWN = "DOWN",
    NEUTRAL = "NEUTRAL",
}

export interface AiSummaryNote {
    content: string;
    type: NoteType;
}

export interface AiSummaryResponse {
    summaryParagraph: string;
    notes: AiSummaryNote[];
    trend: SummaryTrend;
}
