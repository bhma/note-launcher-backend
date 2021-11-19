export interface INote{
    NOTE_ID: number;
    OCCURRENCE_DATE: Date;
    OCCURRENCE_MONTH: string;
    VALUE: number;
    SCHOOL_ID: number;
    DESCRIPTION: string;
    IS_ACTIVE?: boolean;
}