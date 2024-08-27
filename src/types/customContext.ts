// src/types/customContext.ts
import { Context, Scenes } from 'telegraf';
import { TypeScene } from '../config/constants';

export interface SceneContext {
    sceneName: TypeScene;
    contextData: {};
}

export interface Data {
    messages: Array<number>;
    scenes: Array<SceneContext>;
}

export interface BotContext extends Context {
    data: Data;
    scene: Scenes.SceneContextScene<BotContext, Scenes.WizardSessionData>;
    wizard: Scenes.WizardContextWizard<BotContext>;
}


