import EdithorTool from "../../Types/EdithorTool";

export default class BoldElements implements EdithorTool {
    getMarkdown(text: string): string {
        return `**${text}**`;
    };

    getHtml(text: string): string {
        return `<b>${text.length ? text : "Bold"}</b>`;
    };
};
