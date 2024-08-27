// src/scenes/findAccountScene.ts
import { Scenes } from 'telegraf';
import { BotContext } from '../types/customContext';
import { createInlineButtons } from '../utils/helpers';
import { findInvoices } from '../utils/dataProvider';
import { TypeScene } from '../config/constants';
import { SceneComposer } from '../middleware/composer';

export class FindAccountScene extends Scenes.WizardScene<BotContext> {
    private composer: SceneComposer;
    constructor() {
        super(TypeScene.FindAccountScene,
            async (ctx) => {
                await ctx.reply(`Поиск ЛС\nвведите номер лицевого счета:`);
                return ctx.wizard.next();
            },
            async (ctx) => {
                const initData = ctx.scene.state as { id: string };
                const userInput = (ctx.message as { text: string })?.text;
                const foundInvoices = findInvoices(initData.id, userInput);
                if (foundInvoices === undefined || foundInvoices.length == 0) {
                    ctx.reply('Лицевой счет не ненайден. Повторите попытку:');
                } else {
                    const buttons = createInlineButtons(
                        foundInvoices.map(function (item) {
                            return { text: `${item.type} ${item.amount / 100} за ${item.period}`, callback_data: `invoice|${item.id}` }
                        })
                    );
                    this.composer.setButtons(ctx, `Ваши квитанции:`, buttons);
                    await this.composer.showButtons();
                }
            }
        );
        this.composer = SceneComposer.getInstance();
        this.action(/invoice\|.+/, async (ctx) => {
            const invId = ctx.match.input.split('|')[1];
            ctx.scene.enter(TypeScene.InvoiceScene, { id: invId });
        });
    }
}