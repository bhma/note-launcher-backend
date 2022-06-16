import { IBalance } from './../Models/balance.model';
import { Request, Response } from "express";
import { BalanceService } from '../Services/BalanceService';

export class BalanceController {
    async getAll(req: Request, res: Response) {

    }

    async getById(req: Request, res: Response) {

    }

    async create(req: Request, res: Response) {
        const {
            CREATED_ON,
            OCCURRENCE_MONTH,
            VALUE
        } = req.body;
        const newBalance: IBalance = {
            BALANCE_ID: 0,
            CREATED_ON,
            OCCURRENCE_MONTH,
            VALUE
        };

        try {
            const balanceService = new BalanceService();
            balanceService.create(newBalance, handleCreateBalance)
        } catch (error) {
            console.warn('Erro no BalanceController: create balance.');
            console.error(error);
        }
        function handleCreateBalance(err: Error){
            if(err){
                res.json(err);
            }else{
                res.json('Balance Created!');
            }
        }
    }

    async update(req: Request, res: Response){

    }
}