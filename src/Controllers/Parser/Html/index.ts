import sanitizeHtml from "sanitize-html";
import EdithorRule from "../../../Types/EdithorRule";

export default class HtmlParser {
    static #getAllChildren(input: Element, elements = []) {
        for(let index = 0; index < input.children.length; index++) {
            elements.push(input.children[index]);

            this.#getAllChildren(input.children[index], elements);
        }

        return elements;
    };

    static #sanitize(innerHTML: string) {
        return sanitizeHtml(innerHTML, {
            allowedTags: [ "h1", "h2", "h3", "h4", "h5", "h6", "b", "i" ]
        });
    };

    static parse(input: Element, rules: EdithorRule[]) {
        const children = this.#getAllChildren(input);

        let result = input.innerHTML;

        console.debug("HTMLParser: innerHTML", result);

        rules.filter((rule) => rule.parseHtml).forEach((rule) => result = rule.parseHtml(result, children));

        result = this.#sanitize(result);

        console.debug("HTMLParser: markdown", result);

        return result;
    };
};
