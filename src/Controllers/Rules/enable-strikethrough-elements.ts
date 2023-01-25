import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleConditions from "../../Types/EdithorRuleConditions";
import Utils from "../Utils";

type EnableStrikethroughElementsOptions = {
    syntax?: string | string[]
};

export default class EnableStrikethroughElements implements EdithorRule {
    options: EnableStrikethroughElementsOptions;
    
    constructor(options?: EnableStrikethroughElementsOptions) {
        this.options = options;
    };

    conditions: EdithorRuleConditions;

    parseMarkdown(input: string): string {
        let syntax = this.options?.syntax ?? [ "~~" ];

        return Utils.replaceWrappedTags(input, syntax, "<s>", "</s>");
    };
};

