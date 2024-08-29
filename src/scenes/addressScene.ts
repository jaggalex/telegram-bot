// src/scenes/addressScene.ts
import { BotContext } from "../types/customContext";
import { BaseScene } from './baseScene';
import { TypeScene } from "../config/constants";
import { formatCurrency, createInlineButtons, createInlineButtonsByKeys } from '../utils/helpers';
import { findAddressByID, findInvoices, getAccountByAddress } from '../utils/dataProvider'
import { LABEL as LBL, ERRORS as ERR } from '../../lang/messages';

export class AddressScene extends BaseScene {
    constructor() {
        super(TypeScene.AddressScene);
    }

    override async enterScene(ctx: BotContext) {
        super.enterScene(ctx);
        const addressId = this.contextData.id;
        if (addressId) {
            const { ...address } = findAddressByID(addressId);
            this.setButtons(ctx,
                ctx.lh.render(
                    LBL.TEMPLATE.ADDRESS_ADDRESS,
                    { address: address.address }),
                createInlineButtonsByKeys(ctx, [this.btnGoHome]));
            await this.showButtons();

            const accounts = getAccountByAddress(ctx.msg.chat.id, this.contextData.id);

            accounts.forEach((async acc => {
                const foundInvoices = findInvoices(acc.org_id, acc.account);
                if (foundInvoices !== undefined && foundInvoices.length > 0) {
                    const buttons = createInlineButtons(
                        foundInvoices.map(function (item) {
                            const amount = ctx.lh.formatCurrency(item.amount);
                            const label = ctx.lh.render(
                                LBL.TEMPLATE.INVOICE_HEADER_TYPE_AMOUNT_PERIOD,
                                {
                                    type: item.type,
                                    amount: amount,
                                    period: item.period
                                });
                            return {
                                text: label,
                                callback_data: `invoice|${item.id}`
                            }
                        }
                        )
                    );

                    this.setButtons(
                        ctx,
                        ctx.lh.render(
                            LBL.TEMPLATE.ACCOUNT,
                            { account: acc.account }),
                        buttons);
                };
            }));

            await this.showButtons();

            this.action(/invoice\|.+/, async (ctx) => {
                const invoiceId = ctx.match.input.split('|')[1];
                this.pushScene(); // push this scene info into stack of scenes
                await ctx.scene.enter(TypeScene.InvoiceScene, { id: invoiceId });
            });
        } else {
            throw new Error(ctx.lh.render(ERR.EMPTY_ADDRESS_ID));
        }
    }
}
