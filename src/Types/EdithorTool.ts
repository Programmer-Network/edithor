export default interface EdithorTool {    
    getMarkdown(text: string): string;
    getHtml(text: string): string;
};
