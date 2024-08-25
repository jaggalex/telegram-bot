// src/scenes/findAccountScene.ts
import { Scenes, Markup } from 'telegraf';
import { BotContext } from '../types/customContext';
import { InlineKeyboardButton } from 'telegraf/types';
import { findInvoices } from '../utils/dataProvider';
import { TypeScene } from '../config/constants';

const findAccountScene = new Scenes.WizardScene<BotContext>(
    TypeScene.FindAccountScene,
    async (ctx) => {
        const findMessage = await ctx.reply(
            `Поиск ЛС\nвведите номер лицевого счета:`);
        //await saveMessages(ctx, [findMessage.message_id]);
        return ctx.wizard.next();

    },
    async (ctx) => {
        let messages: Array<number> = [];
        const userInput = (ctx.message as { text: string })?.text;
        if (!userInput) {
            ctx.reply('Ошибка ввода. Введите верный номер ЛС:');
            return;
        }
        let buttons: Array<Array<InlineKeyboardButton.CallbackButton>> = [];
        const { orgID } = ctx.scene.state as { orgID: string };
        const foundInvoices = findInvoices(orgID, userInput);
        if (foundInvoices === undefined || foundInvoices.length == 0) {
            ctx.reply('Лицевой счет не ненайден. Повторите попытку:');
        } else {
            //.ctx.data.session = foundInvoices;
            foundInvoices.forEach(item => {
                buttons.push(
                    [Markup.button.callback(`${item.type} ${item.amount / 100} за ${item.period}`, `invoice|${item.id}`)]
                );
            });
            //buttons.push(btnBottom);
            const orgMessage = await ctx.reply(`Ваши квитанции:`, Markup.inlineKeyboard(
                buttons
            ));
            messages.push(orgMessage.message_id);
        }
    }
);

findAccountScene.action(/invoice\|.+/, async (ctx) => {
    const invId = ctx.match.input.split('|')[1];
    await ctx.scene.enter(TypeScene.InvoiceScene, { id: invId });
});

export default findAccountScene;