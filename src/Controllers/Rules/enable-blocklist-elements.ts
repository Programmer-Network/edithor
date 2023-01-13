import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleStates from "../../Types/EdithorRuleStates";
import Utils from "../Utils";

type EnableBlocklistElementsOptions = {
    syntax?: string | string[]
};

export default class EnableBlocklistElements implements EdithorRule {
    options: EnableBlocklistElementsOptions;
    
    constructor(options?: EnableBlocklistElementsOptions) {
        this.options = options;
    };

    conditions: EdithorRuleStates;

    process(input: string): string {
        let syntax = this.options?.syntax ?? [ '*' ];
        
        return Utils.replaceStartingBlockTag(input, syntax, "<ul>", "</ul>", "<li>", "</li>");
    };
};

