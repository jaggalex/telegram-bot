// src/middleware/sessionMiddleware.ts
import { Redis } from 'ioredis';
import { BotContext } from '../types/customContext';
import { REDIS_URL } from '../config';

const redisClient = new Redis(REDIS_URL);

export const sessionMiddleware = () => {
    return async (ctx: BotContext, next: () => Promise<void>) => {
        const sessionId = ctx.from?.id.toString() || '';
        if (sessionId) {
            const sessionData = await redisClient.get(sessionId);
            ctx.data = sessionData ? JSON.parse(sessionData) : {};
        }
        await next();
        if (sessionId) {
            await redisClient.set(sessionId, JSON.stringify(ctx.data));
        }
    };
};
