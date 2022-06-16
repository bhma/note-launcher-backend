import { db } from "../Database";
import { INote } from "../Models/note.model";
import fs from 'fs';
import excel, { Workbook } from 'exceljs';

class NoteService {
    async getNotes(callback: Function) {
        try {
            db.all(`SELECT * FROM NOTE;`,
                (err: Error, rows: INote[]) => {
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
                (err: Error, row: INote) => {
                    callback(err, row);
                });
        } catch (error) {
            console.warn('Erro no noteService: getNoteById');
            console.error(error);
        }
    }

    async getNoteByMonth(month: string, callback: Function, schoolId?: number) {
        try {
            if(schoolId){
                db.all(`SELECT * FROM NOTE
                        WHERE OCCURRENCE_MONTH LIKE ? AND SCHOOL_ID = ?`,
                    [month, schoolId],
                    (err: Error, notes: INote[]) => {
                        db.get(`SELECT SUM(VALUE) AS SumValues
                                FROM NOTE
                                WHERE OCCURRENCE_MONTH LIKE ? AND SCHOOL_ID = ?`, [month, schoolId],
                            (err, sumValues) => {
                                callback(err, notes, sumValues);
                            });
                    });
            }else{
                db.all(`SELECT * FROM NOTE
                        WHERE OCCURRENCE_MONTH LIKE ?`,
                    [month],
                    (err: Error, notes: INote[]) => {
                        db.get(`SELECT SUM(VALUE) AS SumValues
                                FROM NOTE
                                WHERE OCCURRENCE_MONTH LIKE ?`, [month],
                            (err, sumValues) => {
                                callback(err, notes, sumValues);
                            });
                    });
            }
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

    async createExcel(){
        const wb = new excel.Workbook();
        wb.creator = 'Bruno Andrade';
        wb.created = new Date;

        const ws = wb.addWorksheet('Sheet 1');

        ws.columns = [
            { header: 'Id', key: 'id'},
            { header: 'Name', key: 'name'},
            { header: 'Date', key: 'date'}
        ];
        
        
        return this.writeFile(wb);
    }

    async writeFile(wb: Workbook){
        const path = `./`;
        const listFiles = fs.readdirSync(path);
        let fileExcel = listFiles.filter(fileName => {
            return fileName.endsWith('.xlsx');
        })
        if(fileExcel.length > 0){
            fs.rmSync(`${path}${fileExcel.pop()}`);
        }
        await wb.xlsx.writeFile(`ListaNotas.xlsx`);
        return `ListaNotas.xlsx`;
    }
}

export { NoteService };