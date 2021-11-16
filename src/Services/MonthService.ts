import { db } from "../Database";

class MonthService {
    async getMonths(callback: Function){
        try {
            db.all(`SELECT OCCURRENCE_MONTH
                    FROM NOTE
                    GROUP BY OCCURRENCE_MONTH`, (err, rows: string[]) => {
                        callback(err, rows);
                    });
        } catch (error) {
            console.warn('Erro no monthService: getMonths');
            console.error(error);
        }
    }
}

export { MonthService };