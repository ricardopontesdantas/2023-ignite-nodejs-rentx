import redis from "redis"
import { RateLimiterRedis } from "rate-limiter-flexible"
import { NextFunction, Request, Response } from "express"
import { AppError } from "@shared/errors/AppError"

const redisClient = redis.createClient({
    legacyMode: true,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    },
});

const limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "rateLimiter",
    points: 10, // requests
    duration: 5 // per 1 second by IP
})

export default async function rateLimiter(request: Request, response: Response, next: NextFunction) {
    try {
        await limiter.consume(request.ip)
        return next()
    } catch(err) {
        throw new AppError("Too many requests", 429)
    }
}