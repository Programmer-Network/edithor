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

        rules.filter((rule) => rule.parseHtml).forEach((rule) => result = rule.parseHtml(result, children));

        /*for(let index = 0; index < children.length; index++) {
            if(children[index].tagName == "H1")
                result = result.replace(children[index].outerHTML, `# ${this.#sanitize(children[index].innerHTML)}\n`);
        }*/

        result = this.#sanitize(result);

        //result = result.replaceAll(/(^[ \t]*\n)/gm, "");

        //const result = input.innerHTML.replaceAll(children[children.length - 1].outerHTML, "tes");

        return result;
    };
};
