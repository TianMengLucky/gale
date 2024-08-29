import { get, writable } from 'svelte/store';

import en from './en.json';
import zhCN from './zhCN.json';
import Languages from './Languages';

const translations = {
    en,
    zhCN
};

export type Language = 'en' | 'zhCN';
export const LanguageKeys = Object.keys(Languages) as Language[];

const initialLanguage = (navigator.language.replace('-', '') as Language) || 'en';
export const language = writable<Language>(initialLanguage);
export const currentTranslations = writable(translations[initialLanguage]);

export function getLangName(lang: Language) {
    return Languages[lang];
}

export function setLang(lang: Language) {
    language.set(lang);
}

language.subscribe((lang) => {
    currentTranslations.set(translations[lang]);
});

export function t(key: string) : string
{
    return (get(currentTranslations) as { [key: string]: string })[key] || key;
}

/**
 * Translate string with %placeholder%
 * @param translate Translate string
 * @param replacements {"placeholder": "P14C3H01D3R"}
 * @returns Translate string with P14C3H01D3R
 */
export function T(key: string, replacements: { [key: string]: any } = {}): string {
    return replaceString(t(key), replacements)
}

// 替换字符串中%key%或者{key}为replacements[key]
export function replaceString(str: string, replacements: { [key: string] : any }): string {
    return str.replace(/%(\w+)%/g, (_, key) => replacements[key] || `%${key}%`).replace(/{(\w+)}/g, (_, key) => replacements[key] || `{${key}}`);
}
