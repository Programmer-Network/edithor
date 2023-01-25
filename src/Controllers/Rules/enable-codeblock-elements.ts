import { EdithorState } from "../..";
import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleConditions from "../../Types/EdithorRuleConditions";
import EdithorRuleState from "../../Types/EdithorRuleState";
import Highlighter from "../Highlighter";
import Utils from "../Utils";

type EnableCodeblockElementsOptions = {
    syntax?: string | string[]
};

export default class EnableCodeblockElements implements EdithorRule {
    options: EnableCodeblockElementsOptions;
    
    constructor(options?: EnableCodeblockElementsOptions) {
        this.options = options;
    };

    conditions: EdithorRuleConditions = {
        codeBlock: true,
        beforeHtmlEntities: true
    };

    parseMarkdown(input: string, state?: EdithorRuleState): string {
        return Highlighter.getHighlighter().codeToHtml(input, { lang: state?.codeSyntax ?? "txt" }) as string;
    };
};

