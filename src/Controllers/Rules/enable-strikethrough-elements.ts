import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleStates from "../../Types/EdithorRuleStates";
import Utils from "../Utils";

type EnableStrikethroughElementsOptions = {
    syntax?: string | string[]
};

export default class EnableStrikethroughElements implements EdithorRule {
    options: EnableStrikethroughElementsOptions;
    
    constructor(options?: EnableStrikethroughElementsOptions) {
        this.options = options;
    };

    conditions: EdithorRuleStates;

    process(input: string): string {
        let syntax = this.options?.syntax ?? [ "~~" ];

        return Utils.replaceWrappedTags(input, syntax, "<s>", "</s>");
    };
};

