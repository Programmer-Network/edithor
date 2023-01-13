import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleStates from "../../Types/EdithorRuleStates";
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

    conditions: EdithorRuleStates;

    process(input: string): string {
        const syntax = this.options?.syntax ?? '#';
        const minimumDepth = this.options?.minimumDepth ?? 1;
        const maximumDepth = this.options?.maximumDepth ?? 6;

        for(let depth = maximumDepth; depth != minimumDepth - 1; depth--) {
            const depthSyntax = Array(depth).fill(syntax).join('');

            console.log(depthSyntax);

            input = Utils.replaceStartingTag(input, depthSyntax, `<h${depth}>`, `</h${depth}>`);
        }

        return input;
    };
};

