import { IUser } from "../Models/user.model";
import { db } from "../Database";
import Jwt  from "jsonwebtoken";
import { JwtAuth } from "../Models/jwtAuth.model";

export const secret = 'note-launcher'; 

export async function login(user:IUser, callback: Function) {
    try {
        db.get(`SELECT * FROM USER
                WHERE USERNAME = ?`,
            [user.USERNAME],
            (err: Error, row: IUser) => {
                let jwtAuth: JwtAuth = {
                    message: 'Falha na autenticação',
                    token: ''
                };
                if(err){
                    callback(err, jwtAuth);
                }else if(!row){
                    callback(new Error('Falha na autenticação'), jwtAuth);
                } else if(row.PASSWORD !== user.PASSWORD){
                    callback(new Error('Senha inválida'), jwtAuth);
                }else{
                    const token = Jwt.sign({
                        userId: row.USER_ID,
                        username: row.USERNAME
                    },
                    secret,
                    {
                        expiresIn: '1d'
                    });
                    jwtAuth.message = 'Autenticado com sucesso';
                    jwtAuth.token = token;
                    callback(err, jwtAuth);
                }
            });
    } catch (error) {
        console.warn('Erro no loginService: Login');
        console.error(error);
    }
}