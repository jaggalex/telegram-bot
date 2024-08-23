// src/scenes/addressScene.ts
import { BotContext, Initialize } from "../types/customContext";
import { BaseScene } from './baseScene';
import { TypeScene } from "../config/constants";
import { formatCurrency, createInlineButtons } from '../utils/helpers';
import { findAddressByID, findInvoices, getAccountByAddress } from '../utils/dataProvider'


export class AddressScene extends BaseScene {
    constructor() {
        super(TypeScene.AddressScene);
   }

    override async enterScene(ctx: BotContext) {
        super.enterScene(ctx);
        const { addressId } = this.initialize.initParams as {addressId: string};
        const { ...address } = findAddressByID(addressId);

        await this.setButtons(ctx, `Адрес: ${address.address}`, createInlineButtons([this.btnGoHome]));
        await this.showButtons(ctx);

        const accounts = getAccountByAddress(ctx.msg.chat.id, addressId);

        accounts.forEach((async acc => {
            const foundInvoices = findInvoices(acc.org_id, acc.account);
            if (foundInvoices !== undefined && foundInvoices.length > 0) {
                const buttons = createInlineButtons(
                    foundInvoices.map(function(item){ 
                        return {text: `${item.type} ${formatCurrency(item.amount)} за ${item.period}`, 
                        callback_data: `invoice|${item.id}`}}
                    )
                );
                await this.setButtons(ctx, `ЛС: ${acc.account}`, buttons);
            };
        }));

        await this.showButtons(ctx);

        this.action(/invoice\|.+/, async (ctx) => {
            this.leave();
            const invoiceId = ctx.match.input.split('|')[1];
            this.initialize.priorScenes.push({nameScene: this.id as TypeScene, initParams: this.initialize.initParams as {addressId: string}});
            const initialize: Initialize = {
                initParams: {invoiceId: invoiceId},
                priorScenes: this.initialize.priorScenes
            };
            await ctx.scene.enter(TypeScene.InvoiceScene, initialize);
        });
    }

    // Method to transition to main scene
    override async goHome(ctx: BotContext) {
        await ctx.scene.enter(TypeScene.MainScene);
    }
    
}
