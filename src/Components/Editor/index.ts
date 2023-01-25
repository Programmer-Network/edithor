import EdithorRule from "../../Types/EdithorRule";
import EdithorTool from "../../Types/EdithorTool";
import HtmlEditor from "./HtmlEditor";
import MarkdownEditor from "./MarkdownEditor";

export interface CommonEditor {
    addEdithorTool(tool: EdithorTool): void;
};

export type CommonEditorProps = {
    ref: React.RefObject<HtmlEditor> | React.RefObject<MarkdownEditor>,

    rules: EdithorRule[],
    
    input: string,
    inputDidUpdate: Function
};

export type CommonEditorState = {
};

export { HtmlEditor, MarkdownEditor };
