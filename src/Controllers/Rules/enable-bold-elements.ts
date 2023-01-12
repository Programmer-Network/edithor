import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleStates from "../../Types/EdithorRuleStates";

type EnableBoldElementsOptions = {
    syntax?: string | string[]
};

export default class EnableBoldElements implements EdithorRule {
    options: EnableBoldElementsOptions;
    
    constructor(options?: EnableBoldElementsOptions) {
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
        let syntax = this.options?.syntax ?? [ "**", "____" ];

        if(syntax.length === undefined)
            syntax = [ syntax as string ];

        for(let index = 0; index < syntax.length; index++) {
            const encodedSyntax = this.getEncodedString(syntax[index]);

            if(!input.includes(encodedSyntax))
                continue;

            const regExp = new RegExp(`${encodedSyntax}(.*?)${encodedSyntax}`, 'gs');
            input = input.replaceAll(regExp, `<b>$1</b>`);
        }

        return input;
    };
};

