import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleConditions from "../../Types/EdithorRuleConditions";
import Utils from "../Utils";

type EnableHeaderElementsOptions = {
    syntax?: string,
    minimumDepth?: number,
    maximumDepth?: number
};

export default class EnableHeaderElements implements EdithorRule {
    options: EnableHeaderElementsOptions;
    
    constructor(options?: EnableHeaderElementsOptions) {
        this.options = options;
    };

    conditions: EdithorRuleConditions;

    process(input: string): string {
        const syntax = this.options?.syntax ?? '#';
        const minimumDepth = this.options?.minimumDepth ?? 1;
        const maximumDepth = this.options?.maximumDepth ?? 6;

        for(let depth = maximumDepth; depth != minimumDepth - 1; depth--) {
            const depthSyntax = Array(depth).fill(syntax).join('');

            input = Utils.replaceStartingTag(input, depthSyntax, `<h${depth}>`, `</h${depth}>`);
        }

        return input;
    };
};

