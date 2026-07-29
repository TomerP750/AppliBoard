export enum NoteType {
    STRENGTH = "STRENGTH",
    OPPORTUNITY = "OPPORTUNITY",
    CONCERN = "CONCERN",
}

export interface AiSummaryNote {
    content: string;
    type: NoteType;
}

export interface AiSummaryResponse {
    summaryParagraph: string;
    notes: AiSummaryNote[];
}
