import type { ReviewNoteType } from "./ReviewNoteType";

export interface ReviewNoteDto {
    content: string;
    type: ReviewNoteType;
}
