import { ISchool } from './../Models/school.model';
import { db } from "../Database";

class SchoolService {
    async getSchools(callback: Function) {
        try {
            db.all('SELECT * FROM SCHOOL WHERE IS_ACTIVE = 1;', 
            (err: Error, rows: ISchool[]) => {
                callback(err, rows);
            });
        } catch (error) {
            console.warn('Erro no schoolservice: getSchools');
            console.error(error);
        }
    }

    async createSchool(newSchool: ISchool, callback: Function){
        try {
            db.run(`INSERT INTO SCHOOL (SCHOOL_NAME, DIRECTOR_NAME, ADDRESS, IS_ACTIVE) 
                    VALUES (?, ?, ?, 1)`,
                    [newSchool.SCHOOL_NAME, newSchool.DIRECTOR_NAME, newSchool.ADDRESS],
                    (err) => {
                        callback(err?.message);
                    });
        } catch (error) {
            console.warn('Erro no school service: create school');
            console.error(error);
        }
    }

    async updateSchool(updSchool: ISchool, callback: Function){
        try {
            db.run(`UPDATE SCHOOL
                    SET SCHOOL_NAME = ?, 
                        DIRECTOR_NAME = ?,
                        ADDRESS = ?,
                        IS_ACTIVE = ?
                    WHERE SCHOOL_ID = ?`,
                    [updSchool.SCHOOL_NAME, updSchool.DIRECTOR_NAME, updSchool.ADDRESS, updSchool.IS_ACTIVE, updSchool.SCHOOL_ID],
                    (err) => {
                        callback(err?.message)
                    });
        } catch (error) {
            console.warn('Erro no school service: update school');
            console.error(error);
        }
    }

    async getSchoolById(schoolId: number, callback: Function){
        try {
            db.get(`SELECT *
                    FROM SCHOOL
                    WHERE SCHOOL_ID = ?`,
                [schoolId],
                (err: Error, row: ISchool) => {
                   callback(err, row); 
                })
        } catch (error) {
            console.warn('Erro no school service: get school');
            console.error(error);
        }
    }
}

export { SchoolService };