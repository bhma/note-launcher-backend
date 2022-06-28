import { IBalance } from './../Models/balance.model';
import { BalanceService } from './BalanceService';
import { ISchool } from './../Models/school.model';
import { db } from "../Database";
import { INote } from "../Models/note.model";
import fs from 'fs';
import excel, { Workbook, Worksheet } from 'exceljs';
import { SchoolService } from "./SchoolService";

class NoteService {

    schoolList: ISchool[] = [];
    balanceList: IBalance[] = [];
    private schServ: SchoolService = new SchoolService();
    private balSer: BalanceService = new BalanceService();

    

    async getNotes(callback: Function) {
        try {
            db.all(`SELECT * FROM NOTE
                    WHERE IS_ACTIVE = 1;`,
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
            if (schoolId) {
                db.all(`SELECT * FROM NOTE
                        WHERE OCCURRENCE_MONTH LIKE ? AND SCHOOL_ID = ?
                        AND IS_ACTIVE = 1;`,
                    [month, schoolId],
                    (err: Error, notes: INote[]) => {
                        db.get(`SELECT SUM(VALUE) AS SumValues
                                FROM NOTE
                                WHERE OCCURRENCE_MONTH LIKE ? AND SCHOOL_ID = ?`, [month, schoolId],
                            (err, sumValues) => {
                                callback(err, notes, sumValues);
                            });
                    });
            } else {
                db.all(`SELECT * FROM NOTE
                        WHERE OCCURRENCE_MONTH LIKE ?
                        AND IS_ACTIVE = 1;`,
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

    async createExcel(noteList: INote[], total: number, schs: ISchool[], balances: IBalance[]) {
        const wb = new excel.Workbook();
        wb.creator = 'Bruno Andrade';
        wb.created = new Date;
        let lineCount: number = 0;

        const ws = wb.addWorksheet('Sheet 1');
        this.configWs(ws, noteList[0].OCCURRENCE_MONTH);
        lineCount = lineCount + 1;

        noteList.forEach(note => {
            ws.addRow([note.DESCRIPTION, note.OCCURRENCE_DATE, note.VALUE]);
            lineCount = lineCount + 1;
        });
        ws.addRow([]);
        ws.addRow(['Total de gastos', '', total]);
        ws.addRow([]);
        ws.addRow([]);
        ws.addRow(['Entradas', '', '']);
        lineCount = lineCount + 5;
        ws.mergeCells(`A${lineCount}:C${lineCount}`);
        ws.getCell(`C${lineCount}`).alignment = { horizontal: 'center' };
        
        balances.forEach(balance => {
            ws.addRow([schs.find(sch => sch.SCHOOL_ID === balance.SCHOOL_ID)?.SCHOOL_NAME, balance.CREATED_ON, balance.VALUE]);
        });

        const sumBalances = balances.map(bal => bal.VALUE).reduce((prev, curr) => {
            return prev + curr;
        });
        ws.addRow([]);
        ws.addRow(['Total de Entradas', '', sumBalances]);

        // adiciona as notas seprado por escola
        
        const schoolIdList = this.distinctShoolIds(noteList);
        let count = 2;
        schoolIdList.forEach(id => {
            let noteListFiltered = noteList.filter(note => note.SCHOOL_ID === id);
            ws.mergeCells(`E${count}:G${count}`);
            ws.getCell('G'+count).alignment = { horizontal: 'center' };
            ws.getCell('G'+count).value = schs.find(sch => sch.SCHOOL_ID === id)?.SCHOOL_NAME;
            count = count + 2;
            noteListFiltered.forEach(note => {
                ws.getCell('E'+count).value = note.DESCRIPTION;
                ws.getCell('F'+count).value = note.OCCURRENCE_DATE;
                ws.getCell('G'+count).value = note.VALUE;
                count = count + 1;
            });
            count = count + 2;
        });
        return this.writeFile(wb);
    }

    async writeFile(wb: Workbook) {
        const path = `./`;
        const listFiles = fs.readdirSync(path);
        let fileExcel = listFiles.filter(fileName => {
            return fileName.endsWith('.xlsx');
        })
        if (fileExcel.length > 0) {
            fs.rmSync(`${path}${fileExcel.pop()}`);
        }
        await wb.xlsx.writeFile(`ListaNotas.xlsx`);
        return `ListaNotas.xlsx`;
    }

    configWs(ws: Worksheet, month: string) {
        ws.mergeCells('A1:G1');
        ws.getCell('G1').value = `Despesas ${month}`;
        ws.getCell('G1').alignment = { horizontal: 'center' };
        ws.getColumn(1).width = 20;
        ws.getColumn(2).width = 15;
        ws.getColumn(2).numFmt = 'DD/MM/YYYY';
        ws.getColumn(3).numFmt = 'R$ 0.00';
        ws.getColumn(3).width = 18;
        ws.getColumn(4).width = 3;
        ws.getColumn(5).width = 20;
        ws.getColumn(6).width = 15;
        ws.getColumn(6).numFmt = 'DD/MM/YYYY';
        ws.getColumn(7).width = 18;
        ws.getColumn(7).numFmt = 'R$ 0.00';

    }

    distinctShoolIds(noteList: INote[]){
        let schoolIdList = noteList.map(note => note.SCHOOL_ID);
        let schoolIdListDis = schoolIdList.filter((id, pos) => {
            return schoolIdList.indexOf(id) === pos;
        });
        return schoolIdListDis;
    }

    getSchoolName(schId: number){
        return this.schoolList.find(sch => sch.SCHOOL_ID === schId)?.SCHOOL_NAME;
    }

    loadData(){
        this.schServ.getSchools((schs: ISchool[]) => {
            this.schoolList = schs;
        });

        this.balSer.getAll((balList: IBalance[]) => {
            this.balanceList = balList;
        });
    }
}

export { NoteService };