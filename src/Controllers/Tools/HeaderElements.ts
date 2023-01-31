import EdithorTool from "../../Types/EdithorTool";

export default class HeaderElements implements EdithorTool {
    depth: number;

    constructor(depth: number) {
        this.depth = depth;
    }

    getMarkdown(text: string): string {
        return `\n${Array(this.depth).fill('#').join('')} ${text}`;
    };

    getHtml(text: string): string {
        return `\n<h${this.depth}>${text.length ? text : `Header ${this.depth}`}</h${this.depth}>`;
    };
};
