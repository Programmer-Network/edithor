import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleConditions from "../../Types/EdithorRuleConditions";
import Utils from "../Utils";

type EnableBoldElementsOptions = {
    syntax?: string | string[]
};

export default class EnableBoldElements implements EdithorRule {
    options: EnableBoldElementsOptions;
    
    constructor(options?: EnableBoldElementsOptions) {
        this.options = options;
    };

    conditions: EdithorRuleConditions;

    parseMarkdown(input: string): string {
        let syntax = this.options?.syntax ?? [ "**" ];

        return Utils.replaceWrappedTags(input, syntax, "<b>", "</b>");
    };
};

