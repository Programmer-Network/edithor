import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleStates from "../../Types/EdithorRuleStates";

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
        const syntax = `&#${(this.options?.syntax ?? '#').charCodeAt(0)};`;
        const minimumDepth = this.options?.minimumDepth ?? 1;
        const maximumDepth = this.options?.maximumDepth ?? 6;

        for(let depth = maximumDepth; depth != minimumDepth - 1; depth--) {
            const depthSyntax = Array(depth).fill(syntax).join('');

            if(!input.includes(depthSyntax))
                continue;

            const regExp = new RegExp(`^${depthSyntax}\\s(.*)$`, 'gm');
            input = input.replaceAll(regExp, `<h${depth}>$1</h${depth}>`);
        }

        return input;
    };
};

