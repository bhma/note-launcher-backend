import { ISchool } from './../Models/school.model';
import { Request, Response } from 'express';
import { SchoolService } from "../Services/SchoolService";

class SchoolController {
    async getSchools(req: Request, res: Response) {
        try {
            const schoolService = new SchoolService();
            await schoolService.getSchools(handleSchoolList);
        } catch (error) {
            console.warn('Erro no school controller: getSchools');
            console.error(error);
        }

        function handleSchoolList(err: Error, schoolList: ISchool[]) {
            if (err) {
                res.json(err);
            } else {
                res.json(schoolList);
            }
        }
    }

    async createSchool(req: Request, res: Response) {
        const {
            SCHOOL_NAME,
            DIRECTOR_NAME,
            ADDRESS
        } = req.body;
        const newSchool: ISchool = {
            SCHOOL_ID: 0,
            SCHOOL_NAME,
            DIRECTOR_NAME,
            ADDRESS
        }
        try {
            const schoolService = new SchoolService();
            await schoolService.createSchool(newSchool, handleCreateSchool);
        } catch (error) {
            console.warn('Erro no school controller: createSchools');
            console.error(error);
        }
        function handleCreateSchool(err: Error) {
            if (err) {
                res.json(err.message);
            } else {
                res.json('School created!');
            }
        }
    }

    async updateSchool(req: Request, res: Response) {
        const {
            SCHOOL_ID,
            SCHOOL_NAME,
            DIRECTOR_NAME,
            ADDRESS,
            IS_ACTIVE
        } = req.body;
        const newSchool: ISchool = {
            SCHOOL_ID,
            SCHOOL_NAME,
            DIRECTOR_NAME,
            ADDRESS,
            IS_ACTIVE
        }
        try {
            const schoolService = new SchoolService();
            await schoolService.updateSchool(newSchool, handleUpdateSchool);
        } catch (error) {
            console.warn('Erro no school controller: updateSchools');
            console.error(error);
        }
        function handleUpdateSchool(err: Error) {
            if (err) {
                res.json(err.message);
            } else {
                res.json('School updated!');
            }
        }
    }

    async getSchoolById(req: Request, res: Response) {
        const schoolId = req.params['schoolId'];
        try {
            const schoolService = new SchoolService();
            await schoolService.getSchoolById(Number(schoolId), handleGetSchoolById);
        } catch (error) {
            console.warn('Erro no school controller: getByIdSchool');
            console.error(error);
        }
        function handleGetSchoolById(err: Error, school: ISchool) {
            if (err) {
                res.json(err);
            } else {
                res.json(school);
            }
        }
    }

}

export { SchoolController };