// src/index.ts
import { Telegraf } from 'telegraf';
import { BOT_TOKEN } from './config';
import { setupMiddleware } from './middleware';
import { BotContext } from './types/customContext';
import { setupScenes } from './scenes';
import { TypeScene } from './config/constants';

if (BOT_TOKEN) {
    const bot = new Telegraf<BotContext>(BOT_TOKEN);
    // Set up middleware
    setupMiddleware(bot);
    // Set up scenes
    setupScenes(bot);
    // Launch the bot
    bot.launch();
    bot.start((ctx) => ctx.scene.enter(TypeScene.MainScene));
    // Graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
else {
    throw new Error('BOT_TOKEN is not defined in environment variables');
}



