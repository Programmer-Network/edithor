import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleStates from "../../Types/EdithorRuleStates";

type EnableBlockquoteElementsOptions = {
    syntax?: string | string[]
};

export default class EnableBlockquoteElements implements EdithorRule {
    options: EnableBlockquoteElementsOptions;
    
    constructor(options?: EnableBlockquoteElementsOptions) {
        this.options = options;
    };

    conditions: EdithorRuleStates;

    getEncodedString(text: string): string {
        let result = "";

        for(let index = 0; index < text.length; index++)
            result += `&#${text[index].charCodeAt(0)};`;

        return result;
    };

    process(input: string): string {
        let syntax = this.options?.syntax ?? [ '>' ];

        if(syntax.length === undefined)
            syntax = [ syntax as string ];

        const lines = input.split('\n');

        let changed: boolean = false;

        for(let index = 0; index < syntax.length; index++) {
            const encodedSyntax = this.getEncodedString(syntax[index]);

            if(!input.includes(encodedSyntax))
                continue;

            let openBlock: boolean = false;

            for(let line = 0; line < lines.length; line++) {
                if(!lines[line].startsWith(encodedSyntax))
                    continue;

                if(openBlock === false) {
                    lines[line] = "<blockquote>" + lines[line].substring(encodedSyntax.length + 1);

                    openBlock = true;
                    changed = true;
                }
                
                if(openBlock === true) {
                    if(lines[line].startsWith(encodedSyntax))
                        lines[line] = lines[line].substring(encodedSyntax.length + 1);

                    if(line == lines.length - 1 || !lines[line + 1].startsWith(encodedSyntax)) {
                       lines[line] += "</blockquote>";

                       openBlock = false;
                    }
                }
            }
        }

        return (changed)?(lines.join('\n')):(input);
    };
};

