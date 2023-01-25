import React, { Component } from "react";
import { CommonEditor, CommonEditorProps, CommonEditorState } from ".";
import EdithorTool from "../../Types/EdithorTool";

export default class MarkdownEditor extends Component<CommonEditorProps, CommonEditorState> implements CommonEditor {
    textArea: any;

    constructor(props: any) {
        super(props);

        this.textArea = React.createRef();
    };

    addEdithorTool(tool: EdithorTool): void {
        console.log(this.textArea.current);
        const start = this.textArea.current.selectionStart;
        const end = this.textArea.current.selectionEnd;

        const value = [
            this.textArea.current.value.substring(0, start),
            this.textArea.current.value.substring(start, end),
            this.textArea.current.value.substring(end, this.textArea.current.value.length)
        ];

        const input = value[0] + tool.getMarkdown(value[1]) + value[2];

        this.textArea.current.value = input;
        
        this.props.inputDidUpdate(this.textArea.current.value);
    };

    onKeyUp(event) {
        this.props.inputDidUpdate(event.target.value);
    };

    onKeyDown(event) {
        if(event.key === "Tab") {
            event.preventDefault();

            const start = event.target.selectionStart;
            const end = event.target.selectionEnd;

            const tab = "    ";

            event.target.value = event.target.value.substring(0, start) + tab + event.target.value.substring(end);

            event.target.selectionStart = event.target.selectionEnd = start + tab.length;
        }
    };

    render() {
        return (
            <textarea
                ref={this.textArea}
                className="edithor-editable"
                onKeyUp={(event) => this.onKeyUp(event)}
                onKeyDown={(event) => this.onKeyDown(event)}
                defaultValue={this.props.input}
                />
        );
    };
};
