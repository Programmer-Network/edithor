import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleConditions from "../../Types/EdithorRuleConditions";
import Utils from "../Utils";

type EnableBoldAndItalicElementsOptions = {
    syntax?: string | string[]
};

export default class EnableBoldAndItalicElements implements EdithorRule {
    options: EnableBoldAndItalicElementsOptions;
    
    constructor(options?: EnableBoldAndItalicElementsOptions) {
        this.options = options;
    };

    conditions: EdithorRuleConditions;

    parseMarkdown(input: string): string {
        let syntax = this.options?.syntax ?? [ "***" ];

        return Utils.replaceWrappedTags(input, syntax, "<b><i>", "</i></b>");
    };
};

