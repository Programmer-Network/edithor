import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleConditions from "../../Types/EdithorRuleConditions";
import Utils from "../Utils";

type EnableBoldElementsOptions = {
    syntax?: string | string[]
};

export default class EnableBoldElements implements EdithorRule {
    options: EnableBoldElementsOptions;
    
    constructor(options?: EnableBoldElementsOptions) {
        this.options = options;
    };

    conditions: EdithorRuleConditions;

    parseMarkdown(input: string): string {
        let syntax = this.options?.syntax ?? [ "**" ];

        return Utils.replaceWrappedTags(input, syntax, "<b>", "</b>");
    };

    parseHtml(input: string, elements: Element[]): string {
        elements.filter((element) => element.tagName === "B").forEach((element) => {
            input = input.replace(element.outerHTML, `**${element.innerHTML}**`);
        });

        return input;
    };
};

