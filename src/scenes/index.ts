// src/scenes/index.ts
import { Scenes, Telegraf } from 'telegraf';
import { BotContext } from '../types/customContext';
import { MainScene } from './mainScene';
import { AddressScene } from './addressScene';
import { InvoiceScene } from './invoiceScene';
import { FindOrgScene }  from './findOrgScene';


export function setupScenes(bot: Telegraf<BotContext>) {
    const stage = new Scenes.Stage<BotContext>([
        new MainScene(),
        new AddressScene(),
        new InvoiceScene(),
        new FindOrgScene()
    ]);

    bot.use(stage.middleware());
}
