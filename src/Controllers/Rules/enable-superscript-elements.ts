import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleStates from "../../Types/EdithorRuleStates";
import Utils from "../Utils";

type EnableSuperscriptElementsOptions = {
    syntax?: string | string[]
};

export default class EnableSuperscriptElements implements EdithorRule {
    options: EnableSuperscriptElementsOptions;
    
    constructor(options?: EnableSuperscriptElementsOptions) {
        this.options = options;
    };

    conditions: EdithorRuleStates;

    process(input: string): string {
        let syntax = this.options?.syntax ?? [ { opening: "<sup>", closing: "</sup>" } ];

        return Utils.replaceWrappedTags(input, syntax, "<sup>", "</sup>");
    };
};

