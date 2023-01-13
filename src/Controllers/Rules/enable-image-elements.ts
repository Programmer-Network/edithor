import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleConditions from "../../Types/EdithorRuleConditions";
import Utils from "../Utils";

export default class EnableImageElements implements EdithorRule {
    conditions: EdithorRuleConditions = {
        codeBlock: false
    };

    process(input: string): string {
        const exclamationMark = Utils.getEncodedCharacter('!');

        const squareBracketOpen = Utils.getEncodedCharacter('[');
        const squareBracketClose = Utils.getEncodedCharacter(']');
        
        const parenthisOpen = Utils.getEncodedCharacter('(');
        const parenthisClose = Utils.getEncodedCharacter(')');

        const comma = Utils.getEncodedCharacter(',');

        const regExp = new RegExp(`${exclamationMark}${squareBracketOpen}(.*?)${squareBracketClose}${parenthisOpen}(.*?)(?:${comma}([0-9]+)(?:${comma}([0-9]+))?)?${parenthisClose}`, 'gm');

        return input.replaceAll(regExp, (match, text, link, width, height) => {
            console.debug({ width });
            
            try {
                link = Utils.getDecodedString(link);

                new URL(link);

                return `<img src="${link}" alt="${text}"${width && ` width="${width}"`}${height && ` height="${height}"`}/>`;
            }
            catch {
                return match;
            }
        }); 
    };
};

