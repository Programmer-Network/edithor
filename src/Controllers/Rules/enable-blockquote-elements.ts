import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleStates from "../../Types/EdithorRuleStates";
import Utils from "../Utils";

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

        return Utils.replaceStartingBlockTag(input, syntax, "<blockquote>", "</blockquote>");
    };
};

