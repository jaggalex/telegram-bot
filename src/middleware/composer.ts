import { Composer } from "telegraf";
import { BotContext, SceneContext } from "../types/customContext";
import { TypeScene } from "../config/constants";

const mainScene: SceneContext = { sceneName: TypeScene.MainScene, contextData: {} };

export class SceneComposer extends Composer<BotContext> {
    private static instance: SceneComposer;
    private stackScenes: SceneContext[] = [];
    private constructor() {
        super();
        this.action('home', async (ctx) => {
            this.stackScenes = [];
            await ctx.scene.enter(TypeScene.MainScene);
        });

        this.action('back', async (ctx) => {
            const scene = this.stackScenes.pop();
            await ctx.scene.enter(scene?.sceneName || TypeScene.MainScene, scene?.contextData || {});
        });
    }

    public pushScene(scene: SceneContext) {
        this.stackScenes.push(scene);
    }

    public static getInstance(): SceneComposer {
        if (!SceneComposer.instance) {
            SceneComposer.instance = new SceneComposer();
        }
        return SceneComposer.instance;
    }
}