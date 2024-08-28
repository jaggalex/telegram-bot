// src/utils/helpers.ts
import { Markup } from 'telegraf';
import { BotContext } from '../types/customContext';
import { LABEL as LBL } from '../../lang/messages';

// Format a currency
export function formatCurrency(amount: number, currency: string): string {
    return `${amount.toFixed(2)} ${currency}`;
}

export function createInlineButtons(
    buttons: { text: string; callback_data?: string; url?: string }[],
    options: { one_line?: boolean } = { one_line: false }) {

    const inlineKeyboard = buttons.map((button) => {
        if (button.callback_data) {
            const btn = Markup.button.callback(button.text, button.callback_data)
            return options.one_line ? btn : [btn];
        } else if (button.url) {
            const btn = Markup.button.url(button.text, button.url);
            return options.one_line ? btn : [btn];
        } else {
            throw new Error("Button must have either 'callback_data' or 'url'");
        }
    });

    return inlineKeyboard;
}

export function createInlineButtonsByKeys(
    ctx: BotContext,
    buttons: { key: string; callback_data?: string; url?: string }[],
    options: { one_line?: boolean } = { one_line: false }) {

    const inlineKeyboard = buttons.map((button) => {
        if (button.callback_data) {
            const btn = Markup.button.callback(
                ctx.localizationHelper.render(button.key),
                button.callback_data)
            return options.one_line ? btn : [btn];
        } else if (button.url) {
            const btn = Markup.button.url(
                ctx.localizationHelper.render(button.key),
                button.url);
            return options.one_line ? btn : [btn];
        } else {
            throw new Error("Button must have either 'callback_data' or 'url'");
        }
    });

    return inlineKeyboard;
}
