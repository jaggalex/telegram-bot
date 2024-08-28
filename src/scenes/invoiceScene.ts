// src/scenes/invoiceScene.ts
import { BotContext } from "../types/customContext";
import { BaseScene } from './baseScene';
import { TypeScene } from "../config/constants";
import { formatCurrency, createInlineButtons, createInlineButtonsByKeys } from '../utils/helpers';
import { findInvoiceByID } from '../utils/dataProvider'
import { LABEL as LBL, ERRORS as ERR } from '../../lang/messages';

export class InvoiceScene extends BaseScene {
    constructor() {
        super(TypeScene.InvoiceScene);
    }

    override async enterScene(ctx: BotContext) {
        super.enterScene(ctx);
        const invoiceId = this.contextData.id;
        const { ...invoice } = findInvoiceByID(invoiceId);

        if (invoice !== undefined) {
            let srv: string = '';
            invoice.services.forEach(s => {
                const amount = ctx.localizationHelper.formatCurrency(s.amount);
                srv += ctx.localizationHelper.render(LBL.TEMPLATE.INVOICE_ITEM_NAME_AMOUNT, {
                    name: s.name,
                    amount: amount
                });
            });
            let inv = ctx.localizationHelper.render(LBL.TEMPLATE.INVOICE_DOC_TYPE_ACCOUNT_PERIOD_AMOUNT, {
                type: invoice.type,
                account: invoice.account,
                period: invoice.period,
                amount: ctx.localizationHelper.formatCurrency(invoice.amount)
            });
            inv += srv;
            const buttons = createInlineButtonsByKeys(ctx,
                [
                    { key: LBL.BUTTON.PDF, url: `https://v1.doma.ai` },
                    { key: LBL.BUTTON.SAVE, callback_data: `save|${invoiceId}` },
                    { key: LBL.BUTTON.PAY, url: `https://v1.doma.ai` },
                ],
                { one_line: true }
            );
            const btns = createInlineButtonsByKeys(
                ctx, [this.btnGoBack, this.btnGoHome], { one_line: true });
            this.composer.setButtons(ctx, inv, [buttons, btns]);
        } else {
            throw new Error(this.lnMsg(ctx, ERR.INVOICE_ID_NOT_FOUND));
        }

        await this.showButtons();
    }

}
