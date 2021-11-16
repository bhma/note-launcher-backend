import { db } from "../Database";
import { INote } from "../Models/note.model";

class NoteService {
    async getNotes(callback: Function){
        try {
            db.all(`SELECT * FROM NOTE;`,
            (err, rows: INote[]) => {
                callback(err, rows);
            });
        } catch (error) {
            console.warn('Erro no noteService: getNotes');
            console.error(error);
        }
    }

    async getNoteById(noteId: number, callback: Function){
        try {
            db.get(`SELECT * FROM NOTE
                    WHERE NOTE_ID = ?`,
                [noteId],
                (err, row: INote) => {
                    callback(err, row)
                });
        } catch (error) {
            console.warn('Erro no noteService: getNoteById');
            console.error(error);
        }
    }

    async createNote(newNote: INote, callback: Function){
        try {
            db.run(`INSERT INTO NOTE (OCCURRENCE_DATE, OCCURRENCE_MONTH, VALUE, SCHOOL_ID, DESCRIPTION, IS_ACTIVE)
                    VALUES (?,?,?,?,?,1)`,
                    [newNote.occurrenceDate, newNote.occurrenceMonth,  newNote.value, newNote.schoolId, newNote.description],
                    (err) => {
                        callback(err?.message);
                    });
        } catch (error) {
            console.warn('Erro no noteService: createNote');
            console.error(error);
        }
    }

    async updateNote(updNote: INote, callback: Function){
        try {
            db.run(`UPDATE NOTE
                    SET OCCURRENCE_DATE = ?, 
                        OCCURRENCE_MONTH = ?,
                        VALUE = ?,
                        SCHOOL_ID = ?,
                        DESCRIPTION = ?,
                        IS_ACTIVE = 1
                    WHERE NOTE_ID = ?`,
                    [updNote.occurrenceDate, updNote.occurrenceMonth, updNote.value, updNote.schoolId, updNote.description, updNote.id],
                    (err) => {
                        callback(err?.message);
                    });
        } catch (error) {
            console.warn('Erro no noteService: updateNote');
            console.error(error);
        }
    }
}

export { NoteService };