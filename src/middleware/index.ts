// src/middleware/index.ts

import { Telegraf, session } from 'telegraf';
import { sessionMiddleware } from './sessionMiddleware';
import { BotContext } from '../types/customContext';

export function setupMiddleware(bot: Telegraf<BotContext>) {
    bot.use(session());
    bot.use(sessionMiddleware());
}
