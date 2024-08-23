// src/scenes/mainScene.ts
import { BaseScene } from './baseScene';
import { Initialize, BotContext } from '../types/customContext';
import { createInlineButtons } from '../utils/helpers';
import { TypeScene } from '../config/constants';
import { getAddressList, IAddress } from '../utils/dataProvider';

export class MainScene extends BaseScene {

    constructor() {
        super(TypeScene.MainScene);
    }
    
    override async enterScene(ctx: BotContext) {
        super.enterScene(ctx);
        const chatId = ctx.chat?.id;
        if (chatId !== undefined) {
            let addresses: Array<IAddress> = [];

            addresses = getAddressList(chatId);
            const btn = addresses.map(function(item){ 
                return {text: item.address, callback_data: `address|${item.id}`}
            })
            const buttons = createInlineButtons(btn);

            await this.setButtons(ctx, 'Адреса:', buttons);
            await this.showButtons(ctx);

            await this.setButtons(ctx, 'Добавить еще', 
                createInlineButtons([{ text: 'Найти', callback_data: 'find_org' }])
            );
            await this.showButtons(ctx);

            this.action(/address\|.+/, async (ctx) => {
                const addressId = ctx.match.input.split('|')[1];
                const initialize: Initialize = {
                    initParams: { addressId: addressId },
                    priorScenes: [{ nameScene: TypeScene.MainScene, initParams: {} }]
                };
                await ctx.scene.enter(TypeScene.AddressScene, initialize);
            });

            this.action('find_org', async () => {
                const initialize: Initialize = {
                    initParams: {},
                    priorScenes: [{ nameScene: TypeScene.MainScene, initParams: {} }]
                };
                await ctx.scene.enter(TypeScene.FindOrgScene, initialize);
            });
                        
            this.action('find_org', async (ctx) => {
//                this.leave();
                const addressId = ctx.match.input.split('|')[1];
                const initialize: Initialize = {
                    initParams: { addressId: addressId },
                    priorScenes: [{ nameScene: TypeScene.MainScene, initParams: {} }]
                };
                await ctx.scene.enter(TypeScene.AddressScene, initialize);
            });

    } else { ctx.reply('Chat ID is undefined!') };
    }

}

