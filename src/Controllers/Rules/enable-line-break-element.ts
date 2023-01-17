import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleConditions from "../../Types/EdithorRuleConditions";

export default class EnableLineBreakElements implements EdithorRule {
    conditions: EdithorRuleConditions = {
        codeBlock: false
    };

    parseMarkdown(input: string): string {
        const carriageReturn = `&#${'\r'.charCodeAt(0)};`;
        const lineFeed = `&#${'\n'.charCodeAt(0)};`;
        
        // appended line feed is required for post HTML entity encoded rules
        return input.replaceAll(carriageReturn + lineFeed, lineFeed).replaceAll(lineFeed, '<br/>\n'); 
    };

    parseHtml(input: string, elements: Element[]): string {
        elements.filter((element) => element.tagName === "DIV").forEach((element) => {
            input = input.replace(element.outerHTML, `\n${element.innerHTML}`);
        });

        return input;
    };
};

