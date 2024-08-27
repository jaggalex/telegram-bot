// src/middleware/composer.ts
import { Composer } from "telegraf";
import { BotContext, SceneContext } from "../types/customContext";
import { TypeScene } from "../config/constants";
import { Message } from 'telegraf/typings/core/types/typegram';

const mainScene: SceneContext = { sceneName: TypeScene.MainScene, contextData: {} };

export class SceneComposer extends Composer<BotContext> {
    private static instance: SceneComposer;
    private stackScenes: SceneContext[] = [];
    promises: Promise<Message.TextMessage>[] = [];
    messageIds: Array<number> = [];
    private constructor() {
        super();
        this.action('home', async (ctx) => {
            this.stackScenes = [];
            await ctx.scene.enter(TypeScene.MainScene);
        });

        this.action('back', async (ctx) => {
            const scene = this.stackScenes.pop();
            await ctx.scene.enter(scene?.sceneName || TypeScene.MainScene, scene?.contextData || {});
            //return ctx.wizard.next();
        });
    }

    public pushScene(sceneId: string, data: {} = {}) {
        const scene = { sceneName: sceneId as TypeScene, contextData: data }

        this.stackScenes.push(scene);
    }

    public static getInstance(): SceneComposer {
        if (!SceneComposer.instance) {
            SceneComposer.instance = new SceneComposer();
        }
        return SceneComposer.instance;
    }

    // Common method to set inline buttons, finaly run showButtons()
    public setButtons(ctx: BotContext, title: string, buttons: any) {
        this.promises.push(ctx.reply(
            title, { parse_mode: 'HTML', reply_markup: { inline_keyboard: buttons } }
        ));
    }

    // Common method to show buttons
    public async showButtons() {
        const messages: Message.TextMessage[] = await Promise.all(this.promises);
        messages.forEach(msg => this.messageIds.push(msg.message_id));
        this.promises = [];
    }

    // Clear all saved messages
    public async clearMessages(ctx: BotContext) {
        while (this.messageIds.length > 0) {
            let id = this.messageIds.pop();
            await ctx.deleteMessage(id).catch(() => { });
        }
    }
}