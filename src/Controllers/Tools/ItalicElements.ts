import EdithorTool from "../../Types/EdithorTool";

export default class ItalicElements implements EdithorTool {
    getMarkdown(text: string): string {
        return `_${text}_`;
    };

    getHtml(text: string): string {
        return `<i>${text.length ? text : "Italic"}</i>`;
    };
};
