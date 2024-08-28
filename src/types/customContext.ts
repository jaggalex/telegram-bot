// src/types/customContext.ts
import { Context, Scenes } from 'telegraf';
import { TypeScene } from '../config/constants';
import LocalizationHelper from '../locale/localizationHelper';

export interface InlineCallbackButton {
    key: string;
    callback_data: string;
}

export interface InlineUrlButton {
    key: string;
    url: string;
}

export interface SceneContext {
    sceneName: TypeScene;
    contextData: {};
}

export interface Data {
    messages: Array<number>;
    scenes: Array<SceneContext>;
}

export interface BotContext extends Context {
    localizationHelper: LocalizationHelper;
    data: Data;
    scene: Scenes.SceneContextScene<BotContext, Scenes.WizardSessionData>;
    wizard: Scenes.WizardContextWizard<BotContext>;
}


