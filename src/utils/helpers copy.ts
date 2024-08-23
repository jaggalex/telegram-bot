// src/utils/helpers.ts
import { Markup } from 'telegraf';

// Example: Format a currency value
export function formatCurrency(amount: number): string {
    return `${amount.toFixed(2)} руб`;
}

// Create a function to generate inline buttons
export function createInlineButtons(buttons: { text: string; callback_data?: string; url?: string }[]) {
    const inlineKeyboard = buttons.map((button) => {
        if (button.callback_data) {
            return Markup.button.callback(button.text, button.callback_data);
        } else if (button.url) {
            return Markup.button.url(button.text, button.url);
        } else {
            throw new Error("Button must have either 'callback_data' or 'url'");
        }
    });

    return Markup.inlineKeyboard(inlineKeyboard, { columns: 1 });
}