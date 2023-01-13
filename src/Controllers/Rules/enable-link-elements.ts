import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleConditions from "../../Types/EdithorRuleConditions";
import Utils from "../Utils";

export default class EnableLinkElements implements EdithorRule {
    conditions: EdithorRuleConditions = {
        codeBlock: false
    };

    process(input: string): string {
        const squareBracketOpen = Utils.getEncodedCharacter('[');
        const squareBracketClose = Utils.getEncodedCharacter(']');
        
        const parenthisOpen = Utils.getEncodedCharacter('(');
        const parenthisClose = Utils.getEncodedCharacter(')');

        const regExp = new RegExp(`${squareBracketOpen}(.*?)${squareBracketClose}${parenthisOpen}(.*?)${parenthisClose}`, 'gm');

        return input.replaceAll(regExp, (match, text, link) => {
            try {
                link = Utils.getDecodedString(link);

                new URL(link);

                return `<a href="${link}" rel="noreferral" target="_blank">${text}</a>`;
            }
            catch {
                return match;
            }
        }); 
    };
};

