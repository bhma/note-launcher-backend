import { IBalance } from './../Models/balance.model';
import { Request, Response } from "express";
import { BalanceService } from '../Services/BalanceService';

export class BalanceController {
    async getAll(req: Request, res: Response) {
        try {
            const balanceService = new BalanceService();
            balanceService.getAll(handleBalanceList)
        } catch (error) {
            console.warn('Erro no balance controller: getBalances');
            console.error(error);
        }
        function handleBalanceList(err: Error, balanceList: IBalance[]) {
            if (err) {
                res.json(err);
            } else {
                res.json(balanceList);
            }
        }
    }

    async getById(req: Request, res: Response) {
        const balanceId = req.params['id'];
        try {
            const balanceService = new BalanceService();
            balanceService.getById(Number(balanceId),handleGetBalanceById);
        } catch (error) {
            console.warn('Erro no balance controller: getBalanceById');
            console.error(error);
        }
        function handleGetBalanceById(err: Error, balance: IBalance) {
            if (err) {
                res.json(err);
            } else {
                res.json(balance);
            }
        }
    }

    getTotalByMonth(req: Request, res: Response){
        const month = req.params['month'];
        try {
            const balanceService = new BalanceService();
            balanceService.getTotalByMonth(month,handleGetTotalByMonth);
        } catch (error) {
            console.warn('Erro no balance controller: getTotalByMonth');
            console.error(error);
        }
        function handleGetTotalByMonth(err: Error, totalBalance: number) {
            if (err) {
                res.json(err);
            } else {
                res.json(totalBalance);
            }
        }
    }

    async create(req: Request, res: Response) {
        const {
            CREATED_ON,
            OCCURRENCE_MONTH,
            SCHOOL_ID,
            VALUE
        } = req.body;
        const newBalance: IBalance = {
            BALANCE_ID: 0,
            CREATED_ON,
            OCCURRENCE_MONTH,
            SCHOOL_ID,
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
        const {
            BALANCE_ID,
            CREATED_ON,
            OCCURRENCE_MONTH,
            SCHOOL_ID,
            VALUE,
            IS_ACTIVE
        } = req.body;
        const updBalance: IBalance = {
            BALANCE_ID,
            CREATED_ON,
            OCCURRENCE_MONTH,
            SCHOOL_ID,
            VALUE,
            IS_ACTIVE
        };
        try {
            const balanceService = new BalanceService();
            balanceService.update(updBalance, handeUpdateBalance)
        } catch (error) {
            console.warn('Erro no balance controller: update balance');
            console.error(error);
        }

        function handeUpdateBalance(err: Error){
            if (err) {
                res.json(err);
            } else {
                res.json('Balance updated!');
            }
        }
    }
}