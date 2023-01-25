import React, { Component, RefObject } from "react";
import { CommonEditor, CommonEditorProps, CommonEditorState } from ".";
import { HtmlParser } from "../../Controllers/Parser";
import EdithorTool from "../../Types/EdithorTool";

export default class HtmlEditor extends Component<CommonEditorProps, CommonEditorState> implements CommonEditor {
    editor: React.RefObject<HTMLDivElement>;

    constructor(props) {
        super(props);

        this.editor = React.createRef();
    };

    addEdithorTool(tool: EdithorTool): void {
        if(!tool.getHtml)
            return;
            
        this.insertHtmlAtCaret(tool.getHtml(window.getSelection().toString()));

        this.updateInput();

        //activeElement.innerHTML = innerHtml[0] + tool.getHtml(innerHtml[1]) + innerHtml[2];
    };

    getCurrentElement(): HTMLElement {
        const anchorNode = window.getSelection().anchorNode;
        
        let anchorElement = anchorNode;
        
        while(!(anchorElement instanceof Element) && anchorElement !== null)
            anchorElement = anchorElement.parentElement;

        return anchorElement as HTMLElement;
    };

    getCaretOffsetInElement(element) {
        let caretOffset = 0;
        
        const _document = element.ownerDocument || element.document;
        const _window = _document.defaultView || _document.parentWindow;
        
        let selection;

        if(typeof _window.getSelection != "undefined") {
            selection = _window.getSelection();

            if(selection.rangeCount > 0) {
                const range = _window.getSelection().getRangeAt(0);
                
                const preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                
                caretOffset = preCaretRange.toString().length;
            }
        }
        else if ((selection = _document.selection) && selection.type !== "Control") {
            const textRange = selection.createRange();
            
            const preCaretTextRange = _document.body.createTextRange();
            preCaretTextRange.moveToElementText(element);
            preCaretTextRange.setEndPoint("EndToEnd", textRange);
            
            caretOffset = preCaretTextRange.text.length;
        }
        return caretOffset;
    }

    iterateThroughChildren(element, callback) {
        for(let index = 0; index < element.children.length; index++) {
            callback(element.children[index]);

            this.iterateThroughChildren(element.children[index], callback);
        }
    };

    insertHtmlAtCaret(html) {
        var sel, range;
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // only relatively recently standardized and is not supported in
            // some browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    }

    updateInput() {
        const element = this.editor.current;

        const input = HtmlParser.parse(element, this.props.rules);

        this.props.inputDidUpdate(input);
    };

    onKeyUp(event) {
        const element = this.getCurrentElement();
        
        this.updateInput();

        //this.props.inputDidUpdate(event.target.value);
    };

    render() {
        return (
            <div
                ref={this.editor}
                className="edithor-editable"
                contentEditable={true}
                onKeyUp={(event) => this.onKeyUp(event)}
                dangerouslySetInnerHTML={{
                    __html: this.props.input
                }}
                />
        );
    };
};
