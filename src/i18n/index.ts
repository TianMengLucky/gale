import en from './en.json';
import zhCN from './zhCN.json';

const translations = {
    en,
    zhCN
};

export const LanguageKeys = [
    "en",
    "zhCN"
]


export function SetLang(lang : string)
{
    currentLanguage = lang as Language ?? undefined;
    console.info("Set", currentLanguage);
}
const appLanguage = (navigator.language.replace('-', '') as Language) || 'en';

export type Language = 'en' | 'zhCN';
export let currentLanguage : Language = appLanguage;

export let t = translations[currentLanguage]

/**
 * Translate string with %placeholder%
 * @param translate Translate string
 * @param replacements {"placeholder": "P14C3H01D3R"}
 * @returns Translate string with P14C3H01D3R
 */
export function T(translate: string, replacements: { [key: string]: string | undefined }): string {
    return translate.replace(/%(\w+)%/g, (_, key) => replacements[key] || `%${key}%`);
}
