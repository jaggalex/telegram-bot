import nunjucks from 'nunjucks';
import path from 'path';

const locales = ['en', 'ru'];
const translationsDir = path.join(__dirname, '../../lang');

type Translations = {
    [key: string]: {
        [lang: string]: string;
    };
};

class LocalizationHelper {
    private translations: Translations;
    private defaultLanguage: string;

    constructor(defaultLanguage = 'en') {
        this.translations = this.loadTranslations();
        this.defaultLanguage = defaultLanguage;
        nunjucks.configure({ autoescape: true });
    }

    private loadTranslations(): Translations {
        const translations: Translations = {};
        for (const locale of locales) {
            const filePath = path.join(translationsDir, `${locale}.json`);
            translations[locale] = require(filePath);
        }
        return translations;
    }

    public render(
        key: string, context: object = {}, lang: string = this.defaultLanguage
    ): string {
        const translationTemplate = this.translations[lang]?.[key] || this.translations[this.defaultLanguage]?.[key];
        if (!translationTemplate) {
            throw new Error(`Message key "${key}" not found for language "${lang}"`);
        }
        return nunjucks.renderString(translationTemplate, context);
    }

    public formatCurrency(amount: number): string {
        return `${amount.toFixed(2)} ${this.get_currency_code()}`;
    }

    public get_currency_code() {
        return (this.defaultLanguage = 'ru') ? 'руб' : '₽';
    }
}

export default LocalizationHelper;
