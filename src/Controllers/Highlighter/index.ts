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

    static hasSyntax(syntax: string): boolean {
        const bundle = BUNDLED_LANGUAGES.find((bundle) => {
            // Languages are specified by their id, they can also have aliases (i. e. "js" and "javascript")
            return bundle.id === syntax || bundle.aliases?.includes(syntax);
        });

        if(!bundle)
            return false;

        if(this.#syntaxMapping[bundle.id] !== undefined)
            return true;

        if(!this.#highlighter.getLoadedLanguages().includes(bundle.id))
            return false;

        return false;
    };

    static getSyntax(syntax: string): string {
        if(!this.hasSyntax(syntax))
            throw new Error("You must call Highlighter.getSyntaxAsync() first to ensure the syntax is loaded!");

        return this.#syntaxMapping[syntax];
    };

    static async getSyntaxAsync(syntax: string): Promise<string> {
        // Check for the loaded languages, and load the language if it's not loaded yet.
        if(!this.#highlighter.getLoadedLanguages().includes(syntax)) {
            // Check if the language is supported by Shiki
            const bundle = BUNDLED_LANGUAGES.find((bundle) => {
                // Languages are specified by their id, they can also have aliases (i. e. "js" and "javascript")
                return bundle.id === syntax || bundle.aliases?.includes(syntax);
            });

            if(bundle !== undefined) {
                await this.#highlighter.loadLanguage(bundle);

                this.#syntaxMapping[bundle.id] = bundle.id;
            }
            else {
                this.#syntaxMapping[syntax] = "plaintext";
            }
        }

        return this.#syntaxMapping[syntax];
    };
};
