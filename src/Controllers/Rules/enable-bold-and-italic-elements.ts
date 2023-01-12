import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleStates from "../../Types/EdithorRuleStates";

type EnableBoldAndItalicElementsOptions = {
    syntax?: string | string[]
};

export default class EnableBoldAndItalicElements implements EdithorRule {
    options: EnableBoldAndItalicElementsOptions;
    
    constructor(options?: EnableBoldAndItalicElementsOptions) {
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
        let syntax = this.options?.syntax ?? [ "***" ];

        if(syntax.length === undefined)
            syntax = [ syntax as string ];

        for(let index = 0; index < syntax.length; index++) {
            const encodedSyntax = this.getEncodedString(syntax[index]);

            if(!input.includes(encodedSyntax))
                continue;

            const regExp = new RegExp(`${encodedSyntax}(.*?)${encodedSyntax}`, 'gs');
            input = input.replaceAll(regExp, `<b><i>$1</i></b>`);
        }

        return input;
    };
};

