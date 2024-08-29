// src/middleware/index.ts
import { Telegraf, session } from 'telegraf';
import { sessionMiddleware } from './sessionMiddleware';
import { BotContext } from '../types/customContext';
import LocalizationHelper from '../locale/localizationHelper';

export function setupMiddleware(bot: Telegraf<BotContext>) {
    bot.use(session());
    bot.use(sessionMiddleware());
    bot.use((ctx, next) => {
        ctx.lh = new LocalizationHelper(ctx.from?.language_code || 'en');
        return next();
    });
}
