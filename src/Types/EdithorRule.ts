import EdithorRuleConditions from "./EdithorRuleConditions"
import EdithorRuleState from "./EdithorRuleState"

export default interface EdithorRule {    
    conditions: EdithorRuleConditions,

    process(input: string, state?: EdithorRuleState): string
};
