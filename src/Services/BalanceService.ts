import { db } from "../Database";
import { IBalance } from './../Models/balance.model';

export class BalanceService {
    async getAll(callback: Function){
        try {
            db.all(`SELECT * FROM BALANCE
                    WHERE IS_ACTIVE = 1;`,
                (err: Error, rows: IBalance[]) => {
                    callback(err, rows);
                });
        } catch (error) {
            console.warn('Erro no balanceService: getBalances');
            console.error(error);
        }
    }

    async getById(balanceId: number, callback: Function){
        try {
            db.get(`SELECT * FROM BALANCE
                    WHERE BALANCE_ID = ?`,
                [balanceId],
                (err: Error, row: IBalance) => {
                    callback(err, row);
                });
        } catch (error) {
            console.warn('Erro no balanceService: getBalanceById');
            console.error(error);
        }
    }

    getTotalByMonth(month: string, callback: Function){
        try {
            db.get(`SELECT 
                        SUM(VALUE) AS TotalBalance
                    FROM BALANCE
                    WHERE 
                        OCCURRENCE_MONTH LIKE ? AND
                        IS_ACTIVE = 1`,
                [month],
                (err: Error, totalBalance: number) => {
                    callback(err, totalBalance);
                });
        } catch (error) {
            console.warn('Erro no balanceService: getTotalByMonth');
            console.error(error);
        }
    }

    async create(newBalance: IBalance, callback: Function){
        try {
            db.run(`INSERT INTO BALANCE (CREATED_ON, OCCURRENCE_MONTH, SCHOOL_ID, VALUE, IS_ACTIVE)
            VALUES (?,?,?,?,1);`, 
            [newBalance.CREATED_ON, newBalance.OCCURRENCE_MONTH, newBalance.SCHOOL_ID, newBalance.VALUE],
            (err) => callback(err?.message));
        } catch (error) {
            console.log('Erro no balanceService: Create balance');
            console.log(error);
        }
    }

    async update(updBalance: IBalance, callback: Function){
        try {
            db.run(`UPDATE BALANCE
                    SET CREATED_ON = ?, 
                        OCCURRENCE_MONTH = ?,
                        SCHOOL_ID = ?,
                        VALUE = ?,
                        IS_ACTIVE = ?
                    WHERE BALANCE_ID = ?`,
                [updBalance.CREATED_ON, updBalance.OCCURRENCE_MONTH, updBalance.SCHOOL_ID, updBalance.VALUE, updBalance.IS_ACTIVE, updBalance.BALANCE_ID],
                (err) => {
                    callback(err?.message);
                });
        } catch (error) {
            console.warn('Erro no BalanceService: update balance.');
            console.error(error);
        }
    }
}