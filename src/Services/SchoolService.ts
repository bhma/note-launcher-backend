import { ISchool } from './../Models/school.model';
import { db } from "../Database";

class SchoolService {
    async getSchools(callback: Function) {
        try {
            db.all('SELECT * FROM SCHOOL;', 
            (err, rows: ISchool[]) => {
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
                    [newSchool.schoolName, newSchool.directorName, newSchool.address],
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
                        IS_ACTIVE = 1
                    WHERE SCHOOL_ID = ?`,
                    [updSchool.schoolName, updSchool.directorName, updSchool.address, updSchool.id],
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
                (err, row: ISchool) => {
                   callback(err, row); 
                })
        } catch (error) {
            console.warn('Erro no school service: get school');
            console.error(error);
        }
    }
}

export { SchoolService };