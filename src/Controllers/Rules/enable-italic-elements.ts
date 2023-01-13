import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleStates from "../../Types/EdithorRuleStates";
import Utils from "../Utils";

type EnableItalicElementsOptions = {
    syntax?: string | string[]
};

export default class EnableItalicElements implements EdithorRule {
    options: EnableItalicElementsOptions;
    
    constructor(options?: EnableItalicElementsOptions) {
        this.options = options;
    };

    conditions: EdithorRuleStates;
    
    process(input: string): string {
        let syntax = this.options?.syntax ?? [ "*", "_" ];
        
        return Utils.replaceWrappedTags(input, syntax, "<i>", "</i>");
    };
};

