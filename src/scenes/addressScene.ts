7// src/scenes/addressScene.ts
import { BotContext } from "../types/customContext";
import { BaseScene } from './baseScene';
import { TypeScene } from "../config/constants";
import { formatCurrency, createInlineButtons } from '../utils/helpers';
import { findAddressByID, findInvoices, getAccountByAddress } from '../utils/dataProvider'


export class AddressScene extends BaseScene {
    constructor() {
        super(TypeScene.AddressScene,
            async (ctx) => {
                return ctx.wizard.next()
            });
    }

    override async enterScene(ctx: BotContext) {
        super.enterScene(ctx);
        const addressId = this.contextData.id;
        if (addressId) {
            const { ...address } = findAddressByID(addressId);

            await this.setButtons(ctx, `Адрес: ${address.address}`, createInlineButtons([this.btnGoHome]));
            await this.showButtons(ctx);

            const accounts = getAccountByAddress(ctx.msg.chat.id, this.contextData.id);

            accounts.forEach((async acc => {
                const foundInvoices = findInvoices(acc.org_id, acc.account);
                if (foundInvoices !== undefined && foundInvoices.length > 0) {
                    const buttons = createInlineButtons(
                        foundInvoices.map(function (item) {
                            return {
                                text: `${item.type} ${formatCurrency(item.amount)} за ${item.period}`,
                                callback_data: `invoice|${item.id}`
                            }
                        }
                        )
                    );
                    await this.setButtons(ctx, `ЛС: ${acc.account}`, buttons);
                };
            }));

            await this.showButtons(ctx);

            this.action(/invoice\|.+/, async (ctx) => {
                const invoiceId = ctx.match.input.split('|')[1];
                this.pushScene(); // push this scene info into stack of scenes
                await ctx.scene.enter(TypeScene.InvoiceScene, { id: invoiceId });
            });
        } else {
            throw new Error('Got empty address id!');
        }
    }
}
