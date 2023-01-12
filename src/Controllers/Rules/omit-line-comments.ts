import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleStates from "../../Types/EdithorRuleStates";

type OmitLineCommentsOptions = {
    regex: RegExp
};

export default class OmitLineComments implements EdithorRule {
    options: OmitLineCommentsOptions;
    
    constructor(options?: OmitLineCommentsOptions) {
        this.options = options;
    };

    conditions: EdithorRuleStates = {
        codeBlock: false,
        beforeHtmlEntities: true
    };

    process(input: string): string {
        return input.replaceAll(this.options.regex ?? /\<!--(.*?)-->/gs, '');
    };
};

