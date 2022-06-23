import { Request, Response, NextFunction } from 'express';
import { INote } from '../Models/note.model';
import { NoteService } from '../Services/NoteService';
import path from 'path';

class NoteController {
    async getNotes(req: Request, res: Response) {
        try {
            const noteService = new NoteService();
            noteService.getNotes(handleNoteList);
        } catch (error) {
            console.warn('Erro no note controller: getNotes');
            console.error(error);
        }
        function handleNoteList(err: Error, noteList: INote[]) {
            if (err) {
                res.json(err);
            } else {
                res.json(noteList);
            }
        }
    }

    async getNotebyId(req: Request, res: Response) {
        const noteId = req.params['noteId'];
        try {
            const noteService = new NoteService();
            noteService.getNoteById(Number(noteId), handleGetNoteById);
        } catch (error) {
            console.warn('Erro no note controller: getNoteById');
            console.error(error);
        }
        function handleGetNoteById(err: Error, note: INote) {
            if (err) {
                res.json(err);
            } else {
                res.json(note);
            }
        }
    }

    async getNotebyMonth(req: Request, res: Response) {
        const month = req.params['month'];
        const schoolId = req.params['schoolId'];
        try {
            const noteService = new NoteService();
            noteService.getNoteByMonth(month, handleGetNoteByMonth, Number(schoolId));
        } catch (error) {
            console.warn('Erro no note controller: getNoteByMonth');
            console.error(error);
        }
        function handleGetNoteByMonth(err: Error, notes: INote[], sumValues: number) {
            if (err) {
                res.json(err);
            } else {
                res.json({
                    sumValues,
                    notes
                });
            }
        }
    }

    async createNote(req: Request, res: Response) {
        const {
            OCCURRENCE_DATE,
            OCCURRENCE_MONTH,
            VALUE,
            SCHOOL_ID,
            DESCRIPTION,
        } = req.body;
        const newNote: INote = {
            NOTE_ID: 0,
            OCCURRENCE_DATE,
            OCCURRENCE_MONTH,
            VALUE,
            SCHOOL_ID,
            DESCRIPTION
        };
        try {
            const noteService = new NoteService();
            noteService.createNote(newNote, handleCreateNote);
        } catch (error) {
            console.warn('Erro no note controller: createNote');
            console.error(error);
        }
        function handleCreateNote(err: Error) {
            if (err) {
                res.json(err);
            } else {
                res.json('Note created!');
            }
        }
    }

    async createManyNotes(req: Request, res: Response) {
        const newNote: INote[] = req.body;
        try {
            const noteService = new NoteService();
            noteService.createManyNotes(newNote, handleCreateManyNotes);
        } catch (error) {
            console.warn('Erro no note controller: createManyNotes');
            console.error(error);
        }
        function handleCreateManyNotes(err: Error) {
            if (err) {
                return res.json(err);
            } else {
                return res.json('Notes created!');
            }
        }
    }

    async updateNote(req: Request, res: Response) {
        const {
            NOTE_ID,
            OCCURRENCE_DATE,
            OCCURRENCE_MONTH,
            VALUE,
            SCHOOL_ID,
            DESCRIPTION,
            IS_ACTIVE
        } = req.body;
        const updNote: INote = {
            NOTE_ID,
            OCCURRENCE_DATE,
            OCCURRENCE_MONTH,
            VALUE,
            SCHOOL_ID,
            DESCRIPTION,
            IS_ACTIVE
        };
        try {
            const noteService = new NoteService();
            noteService.updateNote(updNote, handleUpdNote);
        } catch (error) {
            console.warn('Erro no note controller: updateNote');
            console.error(error);
        }
        function handleUpdNote(err: Error) {
            if (err) {
                res.json(err);
            } else {
                res.json('Note updated!');
            }
        }
    }

    async exportExcel(req: Request, res: Response){
        const {
            noteList,
            total,
            schList,
            balances
        } = req.body;
        try {
            const noteService = new NoteService();
            const filePath = `./${await noteService.createExcel(noteList, total, schList, balances)}`;
            const fileName = path.basename(filePath);
            res.setHeader('Content-Disposition', 'attachment;filename=' + fileName);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.download(filePath);
        } catch (error) {
            console.warn('Erro no note controller: exportExcel');
            console.error(error);
        }
    }

    
}

export { NoteController };