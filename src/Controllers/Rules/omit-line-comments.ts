import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleConditions from "../../Types/EdithorRuleConditions";

type OmitLineCommentsOptions = {
    regex?: RegExp
};

export default class OmitLineComments implements EdithorRule {
    options: OmitLineCommentsOptions;
    
    constructor(options?: OmitLineCommentsOptions) {
        this.options = options;
    };

    conditions: EdithorRuleConditions = {
        codeBlock: false,
        beforeHtmlEntities: true
    };

    process(input: string): string {
        return input.replaceAll(this.options?.regex ?? /\<!--(.*?)-->/gs, '');
    };
};

