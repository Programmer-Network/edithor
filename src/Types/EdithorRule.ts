import EdithorRuleConditions from "./EdithorRuleConditions"
import EdithorRuleState from "./EdithorRuleState"

export default interface EdithorRule {    
    conditions: EdithorRuleConditions,

    parseMarkdown(input: string, state?: EdithorRuleState): string,
    parseHtml?(input: string, elements: Element[]): string
};
