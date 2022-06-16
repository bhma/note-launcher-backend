import { Router } from "express";
import { MonthController } from "./Controllers/MonthController";
import { NoteController } from "./Controllers/NoteController";
import { SchoolController } from "./Controllers/SchoolController";
import { BalanceController } from './Controllers/BalanceController';

const routes = Router();

// --> Aqui instacia os controllers
const schoolController = new SchoolController();
const noteController = new NoteController();
const monthController = new MonthController();
const balanceController = new BalanceController
// -->

// --> Definição das rotas
// --> Rotas para school
routes.get('/schools', schoolController.getSchools);
routes.get('/school/:schoolId', schoolController.getSchoolById);
routes.post('/createSchool', schoolController.createSchool);
routes.put('/updateSchool', schoolController.updateSchool);

//--> Rotas para note
routes.get('/notes', noteController.getNotes);
routes.get('/notes/:month/:schoolId?', noteController.getNotebyMonth);
routes.get('/note/:noteId', noteController.getNotebyId);
routes.post('/createNote', noteController.createNote);
routes.post('/createManyNotes', noteController.createManyNotes);
routes.put('/updateNote', noteController.updateNote);
routes.get('/exportExcel', noteController.exportExcel);

// --> Rota de month
routes.get('/months', monthController.getMonths);

// -->

// --> Rotas para balance
routes.get('/getBalance/:id', balanceController.getById);
routes.get('/getAllBalances', balanceController.getAll);
routes.post('/createBalance', balanceController.create);
routes.put('/updateBalance', balanceController.update);
// -->

export { routes };