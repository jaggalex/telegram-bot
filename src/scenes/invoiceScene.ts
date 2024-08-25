// src/scenes/invoiceScene.ts
import { BotContext } from "../types/customContext";
import { BaseScene } from './baseScene';
import { TypeScene } from "../config/constants";
import { formatCurrency, createInlineButtons } from '../utils/helpers';
import { findInvoiceByID } from '../utils/dataProvider'

export class InvoiceScene extends BaseScene {
    constructor() {
        super(TypeScene.InvoiceScene, async (ctx) => { return ctx.wizard.next() });
    }    

    override async enterScene(ctx: BotContext) {
        super.enterScene(ctx);
        const invoiceId =  this.contextData.id;
        const { ...invoice } = findInvoiceByID(invoiceId);

        if (invoice !== undefined) {
            let srv: string = '';
            invoice.services.forEach(s => {
                srv += `\n\t\t<i>${s.name}: ${formatCurrency(s.amount)} р</i>`;
            });
            const inv = `<b>Квитанция на оплату</b>\n"${invoice.type}" <b>ЛС</b>: ${invoice.account}\nпериод: ${invoice.period}\nсумма к оплате: ${formatCurrency(invoice.amount)} р${srv}`;
            const buttons = createInlineButtons([
                {text: 'Pdf', url: `https://v1.doma.ai`},
                {text: 'Добавить', callback_data: `save|${invoiceId}`},
                {text: 'Оплатить', url: `https://v1.doma.ai`},
            ], {one_line: true});
            const btns = createInlineButtons([this.btnGoBack, this.btnGoHome, ], {one_line: true});
            await this.setButtons(ctx, inv, [buttons, btns]);
        } else {
            throw new Error(`Invoice Id not found!`);
        }

        await this.showButtons(ctx);
    }

}
