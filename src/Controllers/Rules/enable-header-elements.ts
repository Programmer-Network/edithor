import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleStates from "../../Types/EdithorRuleStates";

type EnableHeaderElementsOptions = {
    character?: string,
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
        const character = `&#${(this.options?.character ?? '#').charCodeAt(0)};`;
        const minimumDepth = this.options?.minimumDepth ?? 1;
        const maximumDepth = this.options?.maximumDepth ?? 4;

        for(let depth = maximumDepth; depth != minimumDepth - 1; depth--) {
            const regExp = new RegExp(`${Array(depth).fill(character).join('')} (.*)`, 'g');

            input = input.replaceAll(regExp, `<h${depth}>$1</h${depth}>`);
        }

        return input;
    };
};

