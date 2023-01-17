import * as shiki from "shiki";
import { BUNDLED_LANGUAGES } from "shiki";

export default class Highlighter {
    static #highlighter = null;

    static async getHighlighterAsync() {
        if(this.#highlighter !== null)
            return this.#highlighter;

        this.#highlighter = await shiki.getHighlighter({
            theme: "dark-plus",
            langs: []
        });

        return this.#highlighter;
    };

    static getHighlighter() {
        if(this.#highlighter === null)
            throw new Error("You must call Highlighter.getHighlighterAsync() first to ensure the highlighter is initialized!");

        return this.#highlighter;
    };

    static #syntaxMapping = {};

    static getAliasLanguage(alias: string): string {
        const bundle = BUNDLED_LANGUAGES.find((bundle) => {
            return bundle.id === alias || bundle.aliases?.includes(alias);
        });

        if(bundle === undefined)
            return null;

        return bundle.id;
    };

    static isLanguageLoaded(language: string): boolean {
        return this.#highlighter.getLoadedLanguages().includes(language);
    };

    static async loadLanguageAsync(language: string): Promise<boolean> {
        const bundle = BUNDLED_LANGUAGES.find((bundle) => {
            return bundle.id === language || bundle.aliases?.includes(language);
        });

        if(bundle !== undefined) {
            await this.#highlighter.loadLanguage(bundle);
            
            return true;
        }

        return false;
    };
};
