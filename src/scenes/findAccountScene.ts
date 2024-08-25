// src/scenes/findAccountScene.ts
import { createInlineButtons } from '../utils/helpers';
import { findInvoices } from '../utils/dataProvider';
import { TypeScene } from '../config/constants';
import { BaseScene } from './baseScene';

export class FindAccountScene extends BaseScene {
    constructor() {
        super(
            TypeScene.FindAccountScene,
            async (ctx) => {
                const userInput = (ctx.message as { text: string })?.text;
                if (!userInput) {
                    ctx.reply('Ошибка ввода. Введите верный номер ЛС:');
                    return;
                }
                const orgID = this.contextData.id;
                const foundInvoices = findInvoices(orgID, userInput);
                if (foundInvoices === undefined || foundInvoices.length == 0) {
                    ctx.reply('Лицевой счет не ненайден. Повторите попытку:');
                } else {
                    const buttons = createInlineButtons(
                        foundInvoices.map(function(item){ 
                            return {text: `${item.type} ${item.amount / 100} за ${item.period}`, 
                            callback_data: `invoice|${item.id}`}}
                        )
                    );
                    await this.setButtons(ctx, `Ваши квитанции:`, buttons);
                    await this.showButtons(ctx);
                }
            }
        );

        this.action(/invoice\|.+/, async (ctx) => {
            const invId = ctx.match.input.split('|')[1];
            this.pushScene(); // push this scene info into stack of scenes
            await ctx.scene.enter(TypeScene.InvoiceScene, { id: invId });
        });

        this.enter(async (ctx) => {
            this.contextData = ctx.scene.state as {id: string};
            const btns = createInlineButtons([this.btnGoBack, this.btnGoHome, ]);
            await this.setButtons(ctx, `Поиск ЛС\nвведите номер лицевого счета:`, [ btns]);
            await this.showButtons(ctx);
            return ctx.wizard.next();
        });   
    }
}