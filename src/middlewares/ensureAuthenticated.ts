import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { UsersRepository } from "../modules/accounts/repositories/implementations/UsersRepository";

interface IPayload {
    sub: string
}

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization

    if(!authHeader) {
        throw new AppError('token missing', 401)
    }

    const [, token] = authHeader.split(' ')

    try {
        const { sub: user_id } = verify(token, '69c6e4a394b794ac45a4ca63761bff01') as IPayload

        const usersRepository = new UsersRepository()

        const user = await usersRepository.findById(user_id)

        if(!user) {
            throw new AppError('user does not exists', 401)
        }

        next()
    } catch(error) {
        throw new AppError('invalid token', 401)
    }
}