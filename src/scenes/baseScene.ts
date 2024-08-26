// src/scenes/baseScene.ts
import { Scenes, Middleware } from 'telegraf';
import { SceneOptions } from 'telegraf/typings/scenes/base';
import { Message } from 'telegraf/typings/core/types/typegram';
import { BotContext, SceneContext } from '../types/customContext';
import { TypeScene,  BUTTON_TEXTS } from '../config/constants';
import { SceneComposer } from '../middleware/composer';


export abstract class BaseScene extends Scenes.WizardScene<BotContext> { // Scenes.BaseScene<BotContext> {
    private composer: SceneComposer;
    promises: Promise<Message.TextMessage>[] = [];
    messageIds: Array<number> = [];
    contextData = {id: ''};

    btnGoBack = {text: BUTTON_TEXTS.BACK, callback_data: 'back'};
    btnGoHome = {text: BUTTON_TEXTS.HOME, callback_data: 'home'};
    btnsGoBackGoHome = [this.btnGoBack, this.btnGoHome];

    constructor(id: string, ...steps: Array<Middleware<BotContext>>) {
        super(id, ...steps);
        this.composer = SceneComposer.getInstance();
        this.enter((ctx) => this.enterScene(ctx));
        this.leave((ctx) => this.leaveScene(ctx));
        this.use(this.composer.middleware());
    }
    
    protected async enterScene(ctx: BotContext) {
        this.contextData = ctx.scene.state as {id: string};
    }
    
    protected async pushScene() {
        const scene = {sceneName: this.id as TypeScene, contextData: this.contextData}
        this.composer.pushScene(scene);
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
}
