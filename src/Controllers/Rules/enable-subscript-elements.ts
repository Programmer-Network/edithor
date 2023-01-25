import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleConditions from "../../Types/EdithorRuleConditions";
import Utils from "../Utils";

type EnableSubscriptElementsOptions = {
    syntax?: string | string[]
};

export default class EnableSubscriptElements implements EdithorRule {
    options: EnableSubscriptElementsOptions;
    
    constructor(options?: EnableSubscriptElementsOptions) {
        this.options = options;
    };

    conditions: EdithorRuleConditions;

    parseMarkdown(input: string): string {
        let syntax = this.options?.syntax ?? [ { opening: "<sub>", closing: "</sub>" } ];

        return Utils.replaceWrappedTags(input, syntax, "<sub>", "</sub>");
    };
};

