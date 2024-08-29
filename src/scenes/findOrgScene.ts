// src/scenes/findOrgScene.ts
import { Scenes } from 'telegraf';
import { BotContext } from '../types/customContext';
import { createInlineButtons } from '../utils/helpers';
import { findOrg } from '../utils/dataProvider';
import { TypeScene } from '../config/constants';
import { SceneComposer } from '../middleware/composer';
import { LABEL as LBL } from '../../lang/messages';

export class FindOrgScene extends Scenes.WizardScene<BotContext> {
    private composer: SceneComposer;
    constructor() {
        super(TypeScene.FindOrgScene,
            async (ctx) => {
                await ctx.reply(ctx.lh.render(LBL.MESSAGE.INVATION_ORG_FIND));
                return ctx.wizard.next();
            },
            async (ctx) => {
                const userInput = (ctx.message as { text: string })?.text;
                const foundOrgs = findOrg(userInput);
                if (foundOrgs === undefined || foundOrgs.length == 0) {
                    ctx.reply(ctx.lh.render(LBL.MESSAGE.ORG_NOT_FOUND));
                } else {
                    const buttons = createInlineButtons(
                        foundOrgs.map(function (item) {
                            return { text: `${item.name}`, callback_data: `organization|${item.id}` }
                        })
                    );
                    this.composer.setButtons(ctx, ctx.lh.render(LBL.MESSAGE.ORG_SELECT), buttons);
                    await this.composer.showButtons();
                }
            },
        );
        this.composer = SceneComposer.getInstance();
        this.action(/organization\|.+/, async (ctx) => {
            const orgID = ctx.match.input.split('|')[1];
            ctx.scene.enter(TypeScene.FindAccountScene, { id: orgID });
        });
    }
}