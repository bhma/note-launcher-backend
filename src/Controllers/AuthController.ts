import jwt  from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import { secret } from '../Services/LoginService';


export function onAuth(req: Request, res: Response, next: NextFunction){
    try {
        const token = req.headers.authorization?.split(' ')[1] || '';
        jwt.verify(token, secret);
        next();
    } catch (error) {
        return res.status(401).send({message: 'Erro na autenticação'})
    }
}