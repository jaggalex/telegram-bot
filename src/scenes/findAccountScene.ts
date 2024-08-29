// src/scenes/findAccountScene.ts
import { Scenes } from 'telegraf';
import { BotContext } from '../types/customContext';
import { createInlineButtons } from '../utils/helpers';
import { findInvoices } from '../utils/dataProvider';
import { TypeScene } from '../config/constants';
import { SceneComposer } from '../middleware/composer';
import { LABEL as LBL } from '../../lang/messages';

export class FindAccountScene extends Scenes.WizardScene<BotContext> {
    private composer: SceneComposer;
    constructor() {
        super(TypeScene.FindAccountScene,
            async (ctx) => {
                await ctx.reply(ctx.lh.render(LBL.MESSAGE.INVATION_ACCOUNT_FIND));
                return ctx.wizard.next();
            },
            async (ctx) => {
                const initData = ctx.scene.state as { id: string };
                const userInput = (ctx.message as { text: string })?.text;
                const foundInvoices = findInvoices(initData.id, userInput);
                if (foundInvoices === undefined || foundInvoices.length == 0) {
                    ctx.reply(ctx.lh.render(LBL.MESSAGE.ACCOUNT_NOT_FOUND));
                } else {
                    const buttons = createInlineButtons(
                        foundInvoices.map(function (item) {
                            return {
                                text:
                                    ctx.lh.render(
                                        LBL.TEMPLATE.INVOICE_HEADER_TYPE_AMOUNT_PERIOD, {
                                        type: item.type,
                                        amount: ctx.lh.formatCurrency(item.amount), period: item.period
                                    }),
                                callback_data: `invoice|${item.id}`
                            }
                        })
                    );
                    this.composer.setButtons(ctx, ctx.lh.render(LBL.MESSAGE.RECEIPTS), buttons);
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