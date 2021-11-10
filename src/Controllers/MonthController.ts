import { Request, Response } from 'express';
import { MonthService } from '../Services/MonthService';

class MonthController {
    async getMonths(req: Request, res: Response){
        try {
            const monthService = new MonthService();
            monthService.getMonths(handleGetMonths);
        } catch (error) {
            console.warn('Erro no month controller: getMonths');
            console.error(error);
        }
        function handleGetMonths(err: Error, monthList: string[]){
            if (err) {
                res.json(err);
            } else {
                res.json(monthList);
            }
        }
    }
}

export { MonthController };