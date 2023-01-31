import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBold, faItalic, faHeading, fa2, fa3, fa4, fa5, faLink, faQuoteLeft, faListUl, faListOl, faCode, faImage, faTextSlash } from "@fortawesome/free-solid-svg-icons";
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import { EdithorState } from "..";
import { HtmlEditor, MarkdownEditor } from "./Editor/"
import BoldElements from "../Controllers/Tools/bold-elements";
import ItalicElements from "../Controllers/Tools/ItalicElements";
import EdithorRule from "../Types/EdithorRule";
import HeaderElements from "../Controllers/Tools/HeaderElements";

export type EditorProps = {
    edithor: EdithorState,
    inputDidUpdate: Function,
    rules: EdithorRule[]
};

type EditorState = {
    markdown: boolean;
    raw: string;

    edithor: EdithorState;
    inputDidUpdate: Function;
};

export default class Editor extends Component<EditorProps, EditorState> {
    editor: any;

    constructor(props: any) {
        super(props);

        this.editor = React.createRef();
    };

    hasEdithor(): boolean {
        return !!this.state?.edithor;
    };

    setEdithor(edithor, inputDidUpdate: Function): void {
        this.setState({ edithor, inputDidUpdate });
    };

    toggleMode() {
        this.setState({
            edithor: this.props.edithor,

            markdown: !(this.state?.markdown !== false)
        });
    };

    render() {
        const tools = [
            { icon: faBold, tool: new BoldElements() },
            { icon: faItalic, tool: new ItalicElements() },
            { icon: faHeading, tool: new HeaderElements(1) },
            { icon: fa2, tool: new HeaderElements(2) },
            { icon: fa3, tool: new HeaderElements(3) },
            { icon: fa4, tool: new HeaderElements(4) },
            { icon: fa5, tool: new HeaderElements(5) },
            { icon: faLink },
            { icon: faQuoteLeft },
            { icon: faListUl },
            { icon: faListOl },
            { icon: faCode },
            { icon: faImage }
        ];

        return (
            <form className="edithor-editor" onSubmit={(event) => event.preventDefault()}>
                <aside className="edithor-rules">
                    {tools.map((tool, index) => (
                        <button onMouseDown={(event) => event.preventDefault()} key={index} onClick={() => this.editor.current.addEdithorTool(tool?.tool)}>
                            <FontAwesomeIcon icon={tool.icon}/>
                        </button>
                    ))}

                    <div className="edithor-rules-right">
                        <button onClick={() => this.toggleMode()}>
                            <FontAwesomeIcon icon={faTextSlash}/>
                        </button>
                        
                        <button onClick={() => this.toggleMode()}>
                            <FontAwesomeIcon icon={faMarkdown}/>
                        </button>
                    </div>
                </aside>

                {(this.state?.markdown !== false)?(
                    <HtmlEditor ref={this.editor} rules={this.props.rules} input={this.state?.edithor.processed} inputDidUpdate={(input) => this.state?.inputDidUpdate(input)}/>
                ):(
                    <MarkdownEditor ref={this.editor} rules={this.props.rules} input={this.state?.edithor.raw} inputDidUpdate={(input) => this.state?.inputDidUpdate(input)}/>
                )}
            </form>
        );
    };
};
