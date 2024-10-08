// src/scenes/mainScene.ts
import { BaseScene } from './baseScene';
import { BotContext } from '../types/customContext';
import { createInlineButtons } from '../utils/helpers';
import { TypeScene } from '../config/constants';
import { getAddressList, IAddress } from '../utils/dataProvider';
import { LABEL as LBL, ERRORS as ERR } from '../../lang/messages';

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
            const btn = addresses.map(function (item) {
                return { text: item.address, callback_data: `address|${item.id}` }
            })
            const buttons = createInlineButtons(btn);

            this.setButtons(ctx,
                ctx.lh.render(LBL.MESSAGE.ADDRESS_LIST),
                [...buttons,]
            );
            await this.showButtons();

            this.setButtons(ctx, ctx.lh.render(LBL.BUTTON.ADD_MORE),
                createInlineButtons([{
                    text: ctx.lh.render(LBL.BUTTON.FIND),
                    callback_data: 'find_org'
                }])
            );
            await this.showButtons();

            this.action(/address\|.+/, async (ctx) => {
                const addressId = ctx.match.input.split('|')[1];
                this.pushScene(); // push this scene info into stack of scenes
                await ctx.scene.enter(TypeScene.AddressScene, { id: addressId });
            });

            this.action('find_org', async () => {
                this.pushScene();
                await ctx.scene.enter(TypeScene.FindOrgScene);
            });
        } else {
            ctx.reply(ctx.lh.render(ERR.UNDEFINED_CHAT_ID))
        };
    }
}

