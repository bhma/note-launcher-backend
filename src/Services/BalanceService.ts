import { db } from "../Database";
import { IBalance } from './../Models/balance.model';

export class BalanceService {
    async getAll(){

    }

    async getById(){

    }

    async create(newBalance: IBalance, callback: Function){
        try {
            db.run(`INSERT INTO BALANCE (CREATED_ON, OCCURRENCE_MONTH, VALUE, IS_ACTIVE)
            VALUES (?,?,?,1);`, 
            [newBalance.CREATED_ON, newBalance.OCCURRENCE_MONTH, newBalance.VALUE],
            (err) => callback(err?.message));
        } catch (error) {
            console.log('Erro no balanceService: Create balance');
            console.log(error);
        }
    }

    async update(){

    }
}