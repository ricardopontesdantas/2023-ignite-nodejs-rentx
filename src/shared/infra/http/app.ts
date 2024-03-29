import 'reflect-metadata'
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express'
import 'express-async-errors'
import swaggerUi from 'swagger-ui-express'

import swaggerFile from '../../../swagger.json'
import { router } from './routes'

import '@shared/container'
import { AppError } from '@shared/errors/AppError'
import createConnection from '@shared/infra/typeorm'
import upload from '@config/upload';
import cors from 'cors';
import rateLimiter from "@shared/infra/http/middlewares/rateLimiter";

createConnection()
const app = express()

app.use(rateLimiter)

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use('/avatar', express.static(`${upload.tmpFolder}/avatar`))
app.use('/cars', express.static(`${upload.tmpFolder}/cars`))

app.use(cors())
app.use(router)

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
    if(error instanceof AppError) {
        return response.status(error.statusCode).json({
            message: error.message
        })
    }

    return response.status(500).json({
        status: 'error',
        message: `Internal server error = ${error.message}`
    })
})

export { app }