// src/scenes/findOrgScene.ts
import { createInlineButtons } from '../utils/helpers';
import { findOrg } from '../utils/dataProvider';
import { TypeScene } from '../config/constants';
import { BaseScene } from './baseScene';
import { Scenes } from 'telegraf';
import { BotContext } from '../types/customContext';

export class FindOrgScene extends Scenes.WizardScene<BotContext> {
    constructor() {
        super(
            TypeScene.FindOrgScene,
            async (ctx) => {
                await ctx.reply(`Поиск организации\nвведите ИНН или наименование:`);
                return ctx.wizard.next();
            },
            async (ctx) => {
                const userInput = (ctx.message as { text: string })?.text;
                await ctx.reply(`You send: ${userInput}`);
            },
            async (ctx) => {
                let messages: Array<number> = [];
                const userInput = (ctx.message as { text: string })?.text;
                const foundOrgs = findOrg(userInput);
                if (foundOrgs === undefined || foundOrgs.length == 0) {
                    ctx.reply('Организация не найдена. Повторите попытку:');
                } else {
                    const buttons = createInlineButtons(
                        foundOrgs.map(function(item){ 
                            return {text: `${item.name}`, 
                            callback_data: `organization|${item.id}`}}
                        )
                    );
                 // await this.setButtons(ctx, `Выберите организацию:`, buttons);
                 // await this.showButtons(ctx);
                }
            }
        );

        this.action(/organization\|.+/, async (ctx) => {
            const orgID = ctx.match.input.split('|')[1];
            //this.pushScene(); // push this scene info into stack of scenes
            await ctx.scene.enter(TypeScene.FindAccountScene, { id: orgID });
        });

//        this.enter(async (ctx) => {
//            const btns = createInlineButtons([this.btnGoHome, ]);
//            await ctx.reply(`Поиск организации\nвведите ИНН или наименование:`);
//            return ctx.wizard.next();
            //ctx.wizard.selectStep(0);
//        });   
    }
}