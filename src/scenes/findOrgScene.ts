// src/scenes/findOrgScene.ts
import { Scenes, Markup } from 'telegraf';
import { BotContext } from '../types/customContext';
import { InlineKeyboardButton } from 'telegraf/types';
import { findOrg } from '../utils/dataProvider';
import { TypeScene } from '../config/constants';

const findOrgScene = new Scenes.WizardScene<BotContext>(
    TypeScene.FindOrgScene,
    async (ctx) => {
        const findMessage = await ctx.reply(
            `Поиск организации\nвведите ИНН или наименование:`);
        return ctx.wizard.next();
    },
    async (ctx) => {
        let messages: Array<number> = [];
        const userInput = (ctx.message as { text: string })?.text;
        if (!userInput) {
            ctx.reply('Ошибка ввода. Введите валидный адрес:');
            return;
        }
        let buttons: Array<Array<InlineKeyboardButton.CallbackButton>> = [];
        const foundOrgs = findOrg(userInput);
        if (foundOrgs === undefined || foundOrgs.length == 0) {
            ctx.reply('Организация ненайдена. Повторите попытку:');
        } else {
            foundOrgs.forEach(item => {
                buttons.push(
                    [Markup.button.callback(item.name, `organization|${item.id}`)]
                );
            });
//            buttons.push(btnBottom);
            const orgMessage = await ctx.reply(`Выберите организации:`, Markup.inlineKeyboard(
                buttons
            ));
            messages.push(orgMessage.message_id);
        }
//        await saveMessages(ctx, messages);
    }
);

findOrgScene.action(/organization\|.+/, async (ctx) => {
    const orgID = ctx.match.input.split('|')[1];
    await ctx.scene.enter(TypeScene.FindAccountScene, { orgID: orgID });
    
});

export default findOrgScene;