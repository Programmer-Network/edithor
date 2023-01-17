import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleConditions from "../../Types/EdithorRuleConditions";
import Utils from "../Utils";

type EnableThematicElementsOptions = {
    syntax?: string | string[]
};

export default class EnableThematicElements implements EdithorRule {
    options: EnableThematicElementsOptions;
    
    constructor(options?: EnableThematicElementsOptions) {
        this.options = options;
    };

    conditions: EdithorRuleConditions;

    parseMarkdown(input: string): string {
        let syntax = this.options?.syntax ?? [ "---" ];

        return Utils.replaceAbsoluteTag(input, syntax, "<hr/>");
    };
};

