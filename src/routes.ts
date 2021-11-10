import { Router } from "express";
import { MonthController } from "./Controllers/MonthController";
import { NoteController } from "./Controllers/NoteController";
import { SchoolController } from "./Controllers/SchoolController";

const routes = Router();

// --> Aqui instacia os controllers
const schoolController = new SchoolController();
const noteController = new NoteController();
const monthController = new MonthController();
// -->

// --> Definição das rotas
// --> Rotas para school
routes.get('/schools', schoolController.getSchools);
routes.get('/school/:schoolId', schoolController.getSchoolById);
routes.post('/createSchool', schoolController.createSchool);
routes.post('/updateSchool', schoolController.updateSchool);

//--> Rotas para note
routes.get('/notes', noteController.getNotes);
routes.get('/note/:noteId', noteController.getNotebyId);
routes.post('/createNote', noteController.createNote);
routes.post('/updateNote', noteController.updateNote);

// --> Rota de month
routes.get('/months', monthController.getMonths);

// -->

export { routes };