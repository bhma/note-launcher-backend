export interface INote{
    NOTE_ID: number;
    OCCURRENCE_DATE: Date;
    OCCURRENCE_MONTH: Date;
    VALUE: number;
    SCHOOL_ID: number;
    DESCRIPTION: string;
    IS_ACTIVE?: boolean;
}