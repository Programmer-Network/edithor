import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleStates from "../../Types/EdithorRuleStates";
import Utils from "../Utils";

type EnableBoldElementsOptions = {
    syntax?: string | string[]
};

export default class EnableBoldElements implements EdithorRule {
    options: EnableBoldElementsOptions;
    
    constructor(options?: EnableBoldElementsOptions) {
        this.options = options;
    };

    conditions: EdithorRuleStates;

    process(input: string): string {
        let syntax = this.options?.syntax ?? [ "**" ];

        return Utils.replaceWrappedTags(input, syntax, "<b>", "</b>");
    };
};

