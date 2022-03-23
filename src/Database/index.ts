import sqlite3  from "sqlite3";

const db = new sqlite3.Database('./database.db', (err) => {
    if(err){
        console.error(err.message);
    }else{
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS SCHOOL (
                SCHOOL_ID     INTEGER PRIMARY KEY AUTOINCREMENT
                                      UNIQUE
                                      NOT NULL,
                SCHOOL_NAME   TEXT    NOT NULL,
                DIRECTOR_NAME TEXT,
                ADDRESS       TEXT,
                IS_ACTIVE     BOOLEAN DEFAULT (true) 
            );`);
            db.run(`CREATE TABLE IF NOT EXISTS NOTE (
                NOTE_ID          INTEGER PRIMARY KEY AUTOINCREMENT
                                         UNIQUE
                                         NOT NULL,
                OCCURRENCE_DATE  DATE    NOT NULL,
                OCCURRENCE_MONTH TEXT    NOT NULL,
                VALUE            REAL    NOT NULL,
                SCHOOL_ID        INTEGER REFERENCES SCHOOL (SCHOOL_ID) 
                                         NOT NULL,
                DESCRIPTION      TEXT,
                IS_ACTIVE        BOOLEAN NOT NULL
                                         DEFAULT (true) 
            );`);
        })
        console.log('Database connected!');
    }
});

export { db };

