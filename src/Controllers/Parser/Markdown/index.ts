import EdithorRule from "../../../Types/EdithorRule";
import Highlighter from "../../Highlighter";
import { ParsedMarkdown } from "../Types/ParsedMarkdown";
import { ParsedSection } from "../Types/ParsedSection";

export default class MarkdownParser {
    static getSections(input: string): ParsedSection[] {
        input = input.replaceAll('\r', '');

        // here we would implement our custom logic to set the "rules" state
        // e.g. define that we're in a code block now

        // for safety, I think the process should be like this:
        // eject the code blocks (e.g. ```(.*?)```) and process the sections individually
        // e.g. first everything up to the first code block opening, then the code block itself, then everything below
        //      the code block closing, the code block obviously being N
        // this is only a special scenario since code blocks contains code, unlike the rest of the content which is just text and markup

        // this is what the "difficult" task will be, mostly due to performance concerns

        const sections = [];
        
        let newLine = true, codeBlock = false, codeSyntax;

        for(let index = 0; index < input.length; index++) {
            if(newLine) {
                newLine = false;

                if(input.substring(index, index + 3) === '```') {
                    if(!codeBlock) {
                        sections.push({
                            codeBlock,
                            text: input.substring(0, index)
                        });

                        codeBlock = true;

                        input = input.substring(index + 3, input.length);
                        index = 0;

                        const newLineIndex = input.indexOf('\n');

                        if(newLineIndex !== -1) {
                            codeSyntax = input.substring(0, newLineIndex);
                            input = input.substring(newLineIndex + 1, input.length);
                        }
                    }
                    else {
                        sections.push({
                            codeBlock,
                            codeSyntax,
                            text: input.substring(0, index)
                        });

                        codeBlock = false;

                        input = input.substring(index + 3, input.length);
                        index = 0;
                    }
                }
            }

            if(input[index] === '\n')
                newLine = true;
        }

        if(input.length !== 0) {
            sections.push({
                codeBlock: false,
                text: input
            });
        }

        return sections;
    };

    static parse(sections: ParsedSection[], allRules: EdithorRule[]): ParsedMarkdown {
        const missingCodeSyntax: string[] = [];

        const processed = sections.map((section) => {
            let processed: string = section.text;

            if(section.codeBlock) {
                if(section.codeSyntax.length === 0)
                    section.codeSyntax = "plaintext";

                const language: string = Highlighter.getAliasLanguage(section.codeSyntax);

                if(language === null)
                    section.codeSyntax = "plaintext";

                if(section.codeSyntax !== "plaintext") {
                    if(!Highlighter.isLanguageLoaded(language)) {
                        if(!missingCodeSyntax.includes(language))
                            missingCodeSyntax.push(language);

                        section.codeSyntax = "plaintext";
                    }
                    else
                        section.codeSyntax = language;
                }
            }

            let rules = allRules.filter((rule) => {
                if(!!rule.conditions?.beforeHtmlEntities === false)
                    return false;

                if(!!rule.conditions?.codeBlock !== section.codeBlock)
                    return false;

                return true;
            });

            rules.forEach((rule) => processed = rule.parseMarkdown(processed, section));

            // this turns _every non-digit/English alphabetic_ character into a HTML entity
            // this is perfectly reasonable. it will not affect network bandwidth - this is client code
            // and it's a perfect XSS prevention.

            // in all our rules, because of this, we use the HTML entities to decode character
            // such as line feeds (\n) and carriage returns (\r)

            // we'll skip code blocks for this

            if(!section.codeBlock) {
                processed = processed.replaceAll(
                    /[^0-9A-Za-z ]/g,
                    c => "&#" + c.charCodeAt(0) + ";"
                );
            }

            rules = allRules.filter((rule) => {
                if(!!rule.conditions?.beforeHtmlEntities === true)
                    return false;

                if(!!rule.conditions?.codeBlock !== section.codeBlock)
                    return false;

                return true;
            });

            rules.forEach((rule) => processed = rule.parseMarkdown(processed, section));

            return processed;
        });

        return {
            text: processed.join(''),
            missingLanguages: missingCodeSyntax
        };
    };
};
