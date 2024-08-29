// src/scenes/baseScene.ts
import { Scenes } from 'telegraf';
import { SceneOptions } from 'telegraf/typings/scenes/base';
import { BotContext, InlineCallbackButton, InlineUrlButton } from '../types/customContext';
import { SceneComposer } from '../middleware/composer';
import { LABEL as LBL, ERRORS as ERR } from '../../lang/messages';


export abstract class BaseScene extends Scenes.BaseScene<BotContext> {
    protected composer: SceneComposer;
    protected contextData = { id: '' };
    protected btnGoHome: InlineCallbackButton = {
        key: LBL.BUTTON.HOME, callback_data: 'home'
    };
    protected btnGoBack: InlineCallbackButton = {
        key: LBL.BUTTON.BACK, callback_data: 'back'
    };
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

    // protected render(ctx: BotContext, key: string, context: {} = {}) {
    //     return ctx.lh.render(key, context);
    // }
}

