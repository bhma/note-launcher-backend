export interface INote{
    id: number;
    occurrenceDate: Date;
    occurrenceMonth: string;
    value: number;
    schoolId: number;
    description: string;
    isActive?: boolean;
}