import { Request, Response } from "express";
import { JwtAuth } from "../Models/jwtAuth.model";
import { IUser } from "../Models/user.model";
import { login } from "../Services/LoginService";


export async function loginController(req: Request, res: Response){
    const {
        username,
        password
    } = req.body;
    const userLogged: IUser = {
        USERNAME: username,
        PASSWORD: password
    };
    try {
        login(userLogged, handleLogin);
    } catch (error) {
        res.status(401).send({message: 'Erro na autenticação'});
    }
    function handleLogin(err: Error, tokenObj: JwtAuth){
        if(err){
            res.status(401).send({message: err.message});
            res.end();
        }else{
            res.status(200).send(tokenObj);
            res.end();
        }
    }
}