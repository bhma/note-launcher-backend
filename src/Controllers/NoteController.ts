import { Request, Response } from 'express';
import { INote } from '../Models/note.model';
import { NoteService } from '../Services/NoteService';

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

    async createNote(req: Request, res: Response) {
        const {
            occurrenceDate,
            occurrenceMonth,
            value,
            schoolId,
            description
        } = req.body;
        const newNote: INote = {
            id: 0,
            occurrenceDate,
            occurrenceMonth,
            value,
            schoolId,
            description
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

    async updateNote(req: Request, res: Response) {
        const {
            noteId,
            occurrenceDate,
            occurrenceMonth,
            value,
            schoolId,
            description
        } = req.body;
        const updNote: INote = {
            id: noteId,
            occurrenceDate,
            occurrenceMonth,
            value,
            schoolId,
            description
        };
        try {
            const noteService = new NoteService();
            noteService.updateNote(updNote, handleUpdNote);
        } catch (error) {
            console.warn('Erro no note controller: createNote');
            console.error(error);
        }
        function handleUpdNote(err: Error){
            if (err) {
                res.json(err);
            } else {
                res.json('Note updated!');
            }
        }
    }
}

export { NoteController };