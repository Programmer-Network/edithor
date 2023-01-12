import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleStates from "../../Types/EdithorRuleStates";

type EnableStrikethroughElementsOptions = {
    syntax?: string | string[]
};

export default class EnableStrikethroughElements implements EdithorRule {
    options: EnableStrikethroughElementsOptions;
    
    constructor(options?: EnableStrikethroughElementsOptions) {
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
        let syntax = this.options?.syntax ?? [ "~~" ];

        if(syntax.length === undefined)
            syntax = [ syntax as string ];

        for(let index = 0; index < syntax.length; index++) {
            const encodedSyntax = this.getEncodedString(syntax[index]);

            if(!input.includes(encodedSyntax))
                continue;

            const regExp = new RegExp(`${encodedSyntax}(.*?)${encodedSyntax}`, 'gs');
            input = input.replaceAll(regExp, `<s>$1</s>`);
        }

        return input;
    };
};

