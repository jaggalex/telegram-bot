// src/scenes/baseScene.ts
import { Scenes } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { BotContext } from '../types/customContext';
import { TypeScene, BUTTON_TEXTS } from '../config/constants';
import { SceneComposer } from '../middleware/composer';


export abstract class BaseScene extends Scenes.WizardScene<BotContext> {
    private composer: SceneComposer;
    promises: Promise<Message.TextMessage>[] = [];
    messageIds: Array<number> = [];
    contextData = { id: '' };

    btnGoBack = { text: BUTTON_TEXTS.BACK, callback_data: 'back' };
    btnGoHome = { text: BUTTON_TEXTS.HOME, callback_data: 'home' };
    btnsGoBackGoHome = [this.btnGoBack, this.btnGoHome];

    constructor(sceneId: string, ...steps: Array<(ctx: BotContext) => any>) {
        super(sceneId, ...steps);
        this.composer = SceneComposer.getInstance();
        this.use(this.composer.middleware());
        this.use(async (ctx, next) => {
            await this.enterScene(ctx);
            next();
        });
        this.leave((ctx) => this.leaveScene(ctx));
    }

    protected async enterScene(ctx: BotContext) {
        this.contextData = ctx.scene.state as { id: string };
    }

    protected async pushScene() {
        const scene = { sceneName: this.id as TypeScene, contextData: this.contextData }
        this.composer.pushScene(scene);
    }

    protected async leaveScene(ctx: BotContext) {
        while (this.messageIds.length > 0) {
            let id = this.messageIds.pop();
            await ctx.deleteMessage(id).catch(() => { });
        }
    }

    // Common method to set inline buttons, finaly run showButtons()
    protected async setButtons(ctx: BotContext, title: string, buttons: any) {
        this.promises.push(ctx.reply(
            title, { parse_mode: 'HTML', reply_markup: { inline_keyboard: buttons } }
        ));
    }

    // Common method to show buttons
    protected async showButtons(ctx: BotContext) {
        const messages: Message.TextMessage[] = await Promise.all(this.promises);
        messages.forEach(msg => this.messageIds.push(msg.message_id));
        this.promises = [];
    }
}
