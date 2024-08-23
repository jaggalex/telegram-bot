// src/types/customContext.ts

import { Context, Scenes, Composer } from 'telegraf';
import { SceneContextScene } from 'telegraf/typings/scenes';
import { TypeScene } from '../config/constants';  


export interface SceneContext {
    scene: TypeScene;
    context: {};
}

export interface Data {
    messages: Array<number>;
    scenes: Array<SceneContext>;
}

export interface PriorScene {
    nameScene: TypeScene;
    initParams: {};
}

export interface Initialize {
    initParams: {};
    priorScenes: PriorScene[];
}

interface SceneSession extends Scenes.SceneSessionData {
    awaitingAccountNumber?: boolean;
    awaitingTIN?: boolean;
    awaitingName?: boolean;
}

// Extend the session object within the context
interface BotSession extends Scenes.SceneSession<SceneSession> {
    // session properties
}

export interface BotContext extends Context {
    data: Data;
    scene: Scenes.SceneContextScene<BotContext, Scenes.WizardSessionData>;
//    session: BotSession;
    wizard: Scenes.WizardContextWizard<BotContext>;
}


// export type BotContext = UserContext & Composer<UserContext>;