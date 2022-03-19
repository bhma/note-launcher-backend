import { db } from "../Database";
import { INote } from "../Models/note.model";

class NoteService {
    async getNotes(callback: Function) {
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

    async getNoteById(noteId: number, callback: Function) {
        try {
            db.get(`SELECT * FROM NOTE
                    WHERE NOTE_ID = ?`,
                [noteId],
                (err, row: INote) => {
                    callback(err, row);
                });
        } catch (error) {
            console.warn('Erro no noteService: getNoteById');
            console.error(error);
        }
    }

    async getNoteByMonth(month: string, callback: Function) {
        try {
            db.all(`SELECT * FROM NOTE
                    WHERE OCCURRENCE_MONTH LIKE ?`,
                [month],
                (err, notes: INote[]) => {
                    // callback(err, rows);
                    db.get(`SELECT SUM(VALUE) AS SumValues
                            FROM NOTE
                            WHERE OCCURRENCE_MONTH LIKE ?`, [month],
                        (err, sumValues) => {
                            callback(err, notes, sumValues);
                        });
                });
        } catch (error) {
            console.warn('Erro no noteService: getNoteByMonth');
            console.error(error);
        }
    }

    async createNote(newNote: INote, callback: Function) {
        try {
            db.run(`INSERT INTO NOTE (OCCURRENCE_DATE, OCCURRENCE_MONTH, VALUE, SCHOOL_ID, DESCRIPTION, IS_ACTIVE)
                    VALUES (?,?,?,?,?,1)`,
                [newNote.OCCURRENCE_DATE, newNote.OCCURRENCE_MONTH, newNote.VALUE, newNote.SCHOOL_ID, newNote.DESCRIPTION],
                (err) => {
                    callback(err?.message);
                });
        } catch (error) {
            console.warn('Erro no noteService: createNote');
            console.error(error);
        }
    }

    async createManyNotes(newNotes: INote[], callback: Function) {
        try {
            let sqlStm: string = `INSERT INTO NOTE (OCCURRENCE_DATE, OCCURRENCE_MONTH, VALUE, SCHOOL_ID, DESCRIPTION, IS_ACTIVE) VALUES `;
            newNotes.forEach((newNote, i) => {
                let valuesString: string;
                valuesString = `('${newNote.OCCURRENCE_DATE}', '${newNote.OCCURRENCE_MONTH}', ${newNote.VALUE}, ${newNote.SCHOOL_ID}, '${newNote.DESCRIPTION}', 1)`
                if (i < newNotes.length - 1) {
                    valuesString = valuesString.concat(', ');
                }
                sqlStm = sqlStm.concat(valuesString);
            });


            db.run(sqlStm, (err) => {
                callback(err?.message);
            });

        } catch (error) {
            console.warn('Erro no noteService: createNote');
            console.error(error);
        }
    }

    async updateNote(updNote: INote, callback: Function) {
        try {
            db.run(`UPDATE NOTE
                    SET OCCURRENCE_DATE = ?, 
                        OCCURRENCE_MONTH = ?,
                        VALUE = ?,
                        SCHOOL_ID = ?,
                        DESCRIPTION = ?,
                        IS_ACTIVE = ?
                    WHERE NOTE_ID = ?`,
                [updNote.OCCURRENCE_DATE, updNote.OCCURRENCE_MONTH, updNote.VALUE, updNote.SCHOOL_ID, updNote.DESCRIPTION, updNote.IS_ACTIVE, updNote.NOTE_ID],
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