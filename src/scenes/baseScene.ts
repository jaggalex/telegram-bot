// src/scenes/baseScene.ts
import { Scenes} from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { BotContext, Initialize, PriorScene } from '../types/customContext';
import { TypeScene,  BUTTON_TEXTS } from '../config/constants';

const mainScene: PriorScene[] = [{nameScene: TypeScene.MainScene, initParams: {}}];

export class BaseScene extends Scenes.BaseScene<BotContext> {
    promises: Promise<Message.TextMessage>[] = [];
    messageIds: Array<number> = [];
    initialize: Initialize = {initParams: {}, priorScenes: []};
    btnGoBack = {text: BUTTON_TEXTS.BACK, callback_data: 'back'};
    btnGoHome = {text: BUTTON_TEXTS.HOME, callback_data: 'home'};
    btnsGoBackGoHome = [this.btnGoBack, this.btnGoHome];

    constructor(sceneId: string) {
        super(sceneId);
        this.enter((ctx) => this.enterScene(ctx));
        this.leave((ctx) => this.leaveScene(ctx));
    }
    
    protected async enterScene(ctx: BotContext) {
        const { initParams, priorScenes } = ctx.scene.state as { initParams?: {}, priorScenes?: [{nameScene: TypeScene, initParams: {}}]};
        this.initialize.priorScenes = priorScenes || mainScene;
        this.initialize.initParams = initParams || {};

        this.action('back', async () => {
            await this.goToPriorScene(ctx);
        });
        this.action('home', async () => {
            await this.goHome(ctx);
        });
    }
    
    protected async leaveScene(ctx: BotContext) {
        while (this.messageIds.length > 0) {
            let id = this.messageIds.pop();
            await ctx.deleteMessage(id).catch(() => { });
        }
    }

    // Common method to set inline buttons
    protected async setButtons( ctx: BotContext, title: string, buttons: any) {
        this.promises.push(ctx.reply( 
            title, {parse_mode: 'HTML',  reply_markup: { inline_keyboard: buttons } }
        ));
    }

    // Common method to show buttons
    protected async showButtons( ctx: BotContext) {
        const messages: Message.TextMessage[] = await Promise.all(this.promises);
        messages.forEach(msg => this.messageIds.push(msg.message_id));
        this.promises = [];
    }

    // Common method to show message
    protected async showMessage( ctx: BotContext, title: string, buttons: any) {
        const message = await ctx.reply( 
            title, {parse_mode: 'HTML', reply_markup: { inline_keyboard: buttons } }
        )
        this.messageIds.push(message.message_id);
    }
    
    // Method to transition to prior scene
    protected async goToPriorScene(ctx: BotContext) {
        const scene = this.initialize.priorScenes.pop();
        const sceneId = scene?.nameScene || TypeScene.MainScene;
        const initialize: Initialize = {
            initParams: scene?.initParams || {},
            priorScenes: this.initialize.priorScenes
        };
        await ctx.scene.enter(sceneId , initialize);
    }

    // Method to transition to main scene
    protected async goHome(ctx: BotContext) {
        const initialize: Initialize = {
            initParams: {},
            priorScenes: mainScene
        };
        await ctx.scene.enter(TypeScene.MainScene, initialize);
    }
    
}
