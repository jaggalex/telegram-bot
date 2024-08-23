// src/utils/helpers.ts
import { Markup } from 'telegraf';

// Format a currency
export function formatCurrency(amount: number): string {
    return `${amount.toFixed(2)} руб`;
}

// Example: Generate inline keyboard buttons
export function _createInlineButtons(options: { text: string, callback_data: string }[]) {
    return options.map(option => 
        [{ text: option.text, callback_data: option.callback_data }]
    );
}

export function createInlineButtons(buttons: { text: string; callback_data?: string; url?: string }[], 
    options: {one_line?: boolean} = {one_line: false}) {
    
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