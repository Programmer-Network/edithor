import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleStates from "../../Types/EdithorRuleStates";

type EnableItalicElementsOptions = {
    syntax?: string | string[]
};

export default class EnableItalicElements implements EdithorRule {
    options: EnableItalicElementsOptions;
    
    constructor(options?: EnableItalicElementsOptions) {
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
        let syntax = this.options?.syntax ?? [ "*", "_" ];

        if(syntax.length === undefined)
            syntax = [ syntax as string ];

        for(let index = 0; index < syntax.length; index++) {
            const encodedSyntax = this.getEncodedString(syntax[index]);

            if(!input.includes(encodedSyntax))
                continue;

            const regExp = new RegExp(`${encodedSyntax}(.*?)${encodedSyntax}`, 'gs');
            input = input.replaceAll(regExp, `<i>$1</i>`);
        }

        return input;
    };
};

