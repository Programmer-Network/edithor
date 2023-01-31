import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleConditions from "../../Types/EdithorRuleConditions";
import Utils from "../Utils";

type EnableItalicElementsOptions = {
    syntax?: string | string[]
};

export default class EnableItalicElements implements EdithorRule {
    options: EnableItalicElementsOptions;
    
    constructor(options?: EnableItalicElementsOptions) {
        this.options = options;
    };

    conditions: EdithorRuleConditions;
    
    parseMarkdown(input: string): string {
        let syntax = this.options?.syntax ?? [ "*", "_" ];
        
        return Utils.replaceWrappedTags(input, syntax, "<i>", "</i>");
    };

    parseHtml(input: string, elements: Element[]): string {
        elements.filter((element) => element.tagName === "I").forEach((element) => {
            input = input.replaceAll(element.outerHTML, `_${element.innerHTML}_`);
        });

        return input;
    };
};

