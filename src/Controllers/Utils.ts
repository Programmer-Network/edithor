export default class Utils {
    static getDecodedString(text: string): string {
        return text.replaceAll(/&#([0-9]*);/g, (match, character) => {
            return String.fromCharCode(character);
        });
    };

    static getEncodedString(text: string): string {
        let result = "";

        for(let index = 0; index < text.length; index++)
            result += this.getEncodedCharacter(text[index]);

        return result;
    };

    static getEncodedCharacter(character: string): string {
        if(character.toLowerCase() !== character.toUpperCase())
            return character;

        return `&#${character.charCodeAt(0)};`;
    };

    static replaceStartingBlockTag(haystack: string, syntax: string | string[], opening: string, closing: string = opening, wrapOpening: string = "", wrapClosing: string = ""): string {
        if(typeof syntax === "string")
            syntax = [ syntax as string ];

        const lines = haystack.split('\n');

        let changed: boolean = false;

        for(let index = 0; index < syntax.length; index++) {
            const encodedSyntax = this.getEncodedString(syntax[index]);

            if(!haystack.includes(encodedSyntax))
                continue;

            let openBlock: boolean = false;

            for(let line = 0; line < lines.length; line++) {
                if(!lines[line].startsWith(encodedSyntax))
                    continue;

                if(openBlock === false) {
                    lines[line] = opening + wrapOpening + lines[line].substring(encodedSyntax.length + 1) + wrapClosing;

                    openBlock = true;
                    changed = true;
                }
                
                if(openBlock === true) {
                    if(lines[line].startsWith(encodedSyntax))
                        lines[line] = wrapOpening + lines[line].substring(encodedSyntax.length + 1) + wrapClosing;

                    if(line == lines.length - 1 || !lines[line + 1].startsWith(encodedSyntax)) {
                       lines[line] += closing;

                       openBlock = false;
                    }
                }
            }
        }

        return (changed)?(lines.join('\n')):(haystack);
    };

    static replaceStartingTag(haystack: string, syntax: string | string[], opening: string, closing: string = opening): string {
        if(typeof syntax === "string")
            syntax = [ syntax as string ];

        for(let index = 0; index < syntax.length; index++) {
            const encodedSyntax = this.getEncodedString(syntax[index]);

            if(!haystack.includes(encodedSyntax))
                continue;

            const regExp = new RegExp(`^${encodedSyntax}\\s(.*?)$`, 'gm');
            haystack = haystack.replaceAll(regExp, `${opening}$1${closing}`);
        }

        return haystack;
    };

    static replaceAbsoluteTag(haystack: string, syntax: string | string[], replacement: string): string {
        if(typeof syntax === "string")
            syntax = [ syntax as string ];

        for(let index = 0; index < syntax.length; index++) {
            const encodedSyntax = this.getEncodedString(syntax[index]);

            if(!haystack.includes(encodedSyntax))
                continue;

            const regExp = new RegExp(`^${encodedSyntax}(.*?)$`, 'gm');
            haystack = haystack.replaceAll(regExp, replacement);
        }

        return haystack;
    };

    static replaceWrappedTags(haystack: string, syntax: string | (string | object)[], opening: string, closing: string = opening): string {
        if(typeof syntax === "string")
            syntax = [ syntax as string ];

        for(let index = 0; index < syntax.length; index++) {
            const currentSyntax = syntax[index];

            if(typeof currentSyntax === "object") {
                const encodedOpeningSyntax = this.getEncodedString(currentSyntax["opening"]);
                const encodedClosingSyntax = this.getEncodedString(currentSyntax["closing"]);
    
                if(!haystack.includes(encodedOpeningSyntax))
                    continue;

                if(!haystack.includes(encodedClosingSyntax))
                    continue;

                // \*([^\s*]+(?:\s+[^\s*]+)*)\*

                const regExp = new RegExp(`${encodedOpeningSyntax}(.*?)${encodedClosingSyntax}`, 'gms');
                haystack = haystack.replaceAll(regExp, (match, group) => {
                    if(group.trim().length !== group.length)
                        return match;

                    return `${opening}${group}${closing}`
                });
            }
            else {
                const encodedSyntax = this.getEncodedString(currentSyntax);
                
                if(!haystack.includes(encodedSyntax))
                    continue;

                const regExp = new RegExp(`${encodedSyntax}(.*?)${encodedSyntax}`, 'gms');
                haystack = haystack.replaceAll(regExp, (match, group) => {
                    if(group.trim().length !== group.length)
                        return match;

                    return `${opening}${group}${closing}`;
                });
            }
        }

        return haystack;
    };
};
