import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleStates from "../../Types/EdithorRuleStates";
import Utils from "../Utils";

type EnableBlocklistOrderedElementsOptions = {
    syntax?: string | string[]
};

export default class EnableBlocklistOrderedElements implements EdithorRule {
    options: EnableBlocklistOrderedElementsOptions;
    
    constructor(options?: EnableBlocklistOrderedElementsOptions) {
        this.options = options;
    };

    conditions: EdithorRuleStates;

    process(input: string): string {
        let syntax = this.options?.syntax ?? [ '-' ];
        
        return Utils.replaceStartingBlockTag(input, syntax, `<ul style="list-style-type: decimal">`, "</ul>", "<li>", "</li>");
    };
};

