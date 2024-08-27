// src/scenes/baseScene.ts
import { Scenes } from 'telegraf';
import { SceneOptions } from 'telegraf/typings/scenes/base';
import { BotContext } from '../types/customContext';
import { BUTTON_TEXTS } from '../config/constants';
import { SceneComposer } from '../middleware/composer';


export abstract class BaseScene extends Scenes.BaseScene<BotContext> {
    private composer: SceneComposer;
    //    promises: Promise<Message.TextMessage>[] = [];
    //    messageIds: Array<number> = [];
    contextData = { id: '' };

    btnGoBack = { text: BUTTON_TEXTS.BACK, callback_data: 'back' };
    btnGoHome = { text: BUTTON_TEXTS.HOME, callback_data: 'home' };
    btnsGoBackGoHome = [this.btnGoBack, this.btnGoHome];

    constructor(id: string, options?: SceneOptions<BotContext>) {
        super(id, options);
        this.composer = SceneComposer.getInstance();
        this.use(this.composer.middleware());
        this.enter((ctx) => this.enterScene(ctx));
        this.leave((ctx) => this.leaveScene(ctx));
    }

    protected async enterScene(ctx: BotContext) {
        this.contextData = ctx.scene.state as { id: string };
    }

    protected async pushScene() {
        this.composer.pushScene(this.id, this.contextData);
    }

    protected async leaveScene(ctx: BotContext) {
        await this.composer.clearMessages(ctx);
    }

    // Common method to set inline buttons, finaly run showButtons()
    protected setButtons(ctx: BotContext, title: string, buttons: any) {
        this.composer.setButtons(ctx, title, buttons);
    }

    // Common method to show buttons
    protected async showButtons() {
        await this.composer.showButtons();
    }
}
