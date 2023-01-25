import EdithorTool from "../../Types/EdithorTool";

export default class ItalicElements implements EdithorTool {
    getMarkdown(text: string): string {
        return `*${text}*`;
    };

    getHtml(text: string): string {
        return `<i>${text}</i>`;
    };
};
