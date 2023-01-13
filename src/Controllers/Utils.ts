export default class Utils {
    static getEncodedString(text: string): string {
        let result = "";

        for(let index = 0; index < text.length; index++)
            result += `&#${text[index].charCodeAt(0)};`;

        return result;
    };

    static replaceStartingBlockTag(haystack: string, syntax: string | string[], opening: string, closing: string = opening): string {
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
                    lines[line] = opening + lines[line].substring(encodedSyntax.length + 1);

                    openBlock = true;
                    changed = true;
                }
                
                if(openBlock === true) {
                    if(lines[line].startsWith(encodedSyntax))
                        lines[line] = lines[line].substring(encodedSyntax.length + 1);

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

    static replaceWrappedTags(haystack: string, syntax: string | string[], opening: string, closing: string = opening): string {
        if(typeof syntax === "string")
            syntax = [ syntax as string ];

        for(let index = 0; index < syntax.length; index++) {
            const encodedSyntax = this.getEncodedString(syntax[index]);

            if(!haystack.includes(encodedSyntax))
                continue;

            const regExp = new RegExp(`${encodedSyntax}(.*?)${encodedSyntax}`, 'gs');
            haystack = haystack.replaceAll(regExp, `${opening}$1${closing}`);
        }

        return haystack;
    };
};
