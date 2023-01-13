import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleConditions from "../../Types/EdithorRuleConditions";
import Utils from "../Utils";

type EnableBlockquoteElementsOptions = {
    syntax?: string | string[]
};

export default class EnableBlockquoteElements implements EdithorRule {
    options: EnableBlockquoteElementsOptions;
    
    constructor(options?: EnableBlockquoteElementsOptions) {
        this.options = options;
    };

    conditions: EdithorRuleConditions;

    process(input: string): string {
        let syntax = this.options?.syntax ?? [ '>' ];

        return Utils.replaceStartingBlockTag(input, syntax, "<blockquote>", "</blockquote>");
    };
};

