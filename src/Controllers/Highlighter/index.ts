import * as shiki from "shiki";
import { BUNDLED_LANGUAGES } from "shiki";

export default class Highlighter {
    static #highlighter = null;

    static async getHighlighterAsync() {
        if(this.#highlighter !== null)
            return this.#highlighter;

        this.#highlighter = await shiki.getHighlighter({
            theme: "github-dark",
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
        if(this.#syntaxMapping[syntax] !== undefined)
            return true;

        return false;
    };

    static holdSyntax(syntax: string): boolean {
        if(this.#syntaxMapping[syntax] !== undefined)
            return;

        this.#syntaxMapping[syntax] = "txt";
    };

    static getSyntax(syntax: string): string {
        if(!this.hasSyntax(syntax))
            throw new Error("You must call Highlighter.getSyntaxAsync() first to ensure the syntax is loaded!");

        return this.#syntaxMapping[syntax];
    };

    static async getSyntaxAsync(syntax: string): Promise<string> {
        this.holdSyntax(syntax);

        // Check for the loaded languages, and load the language if it's not loaded yet.
        if(!this.#highlighter.getLoadedLanguages().includes(syntax)) {
            // Check if the language is supported by Shiki
            const bundle = BUNDLED_LANGUAGES.find((bundle) => {
                // Languages are specified by their id, they can also have aliases (i. e. "js" and "javascript")
                return bundle.id === syntax || bundle.aliases?.includes(syntax);
            });

            if(bundle !== undefined) {
                console.log(JSON.stringify(bundle));
                
                await this.#highlighter.loadLanguage(bundle);
                await this.#highlighter.loadLanguage(bundle);

                console.log(JSON.stringify(bundle));

                this.#syntaxMapping[bundle.id] = bundle.id;
                
                console.log(this.#highlighter.getLoadedLanguages());
            }
            else {
                this.#syntaxMapping[syntax] = "txt";
            }
        }

        return this.#syntaxMapping[syntax];
    };
};
