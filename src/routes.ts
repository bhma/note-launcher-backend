import { Router } from "express";
import { MonthController } from "./Controllers/MonthController";
import { NoteController } from "./Controllers/NoteController";
import { SchoolController } from "./Controllers/SchoolController";
import { BalanceController } from './Controllers/BalanceController';
import { loginController } from "./Controllers/LoginController";
import { onAuth } from "./Controllers/AuthController";

const routes = Router();

// --> Aqui instacia os controllers
const schoolController = new SchoolController();
const noteController = new NoteController();
const monthController = new MonthController();
const balanceController = new BalanceController
// -->

// --> Definição das rotas

// --> Rota de autenticação
routes.post('/login', loginController);

// --> Rotas para school
routes.get('/schools', onAuth, schoolController.getSchools);
routes.get('/school/:schoolId', onAuth, schoolController.getSchoolById);
routes.post('/createSchool', onAuth, schoolController.createSchool);
routes.put('/updateSchool', onAuth, schoolController.updateSchool);

//--> Rotas para note
routes.get('/notes', onAuth, noteController.getNotes);
routes.get('/notes/:month/:schoolId?', onAuth, noteController.getNotebyMonth);
routes.get('/note/:noteId', onAuth, noteController.getNotebyId);
routes.post('/createNote', onAuth, noteController.createNote);
routes.post('/createManyNotes', onAuth, noteController.createManyNotes);
routes.put('/updateNote', onAuth, noteController.updateNote);
routes.post('/exportExcel', onAuth, noteController.exportExcel);

// --> Rota de month
routes.get('/months', onAuth, monthController.getMonths);

// -->

// --> Rotas para balance
routes.get('/getBalance/:id', onAuth, balanceController.getById);
routes.get('/getAllBalances', onAuth, balanceController.getAll);
routes.get('/getTotalByMonth/:month', onAuth, balanceController.getTotalByMonth);
routes.post('/createBalance', onAuth, balanceController.create);
routes.put('/updateBalance', onAuth, balanceController.update);
// -->

export { routes };