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

        const selection = window.getSelection().toString();
        
        let trim = selection.trimStart();
        const trimmedStart = selection.substring(0, selection.length - trim.length);

        trim = selection.trimEnd();
        const trimmedEnd = selection.substring(trim.length);

        const middle = selection.substring(trimmedStart.length, selection.length - trimmedEnd.length);

        const element = tool.getHtml(middle);

        this.insertHtmlAtCaret(trimmedStart + element + trimmedEnd);

        const result = this.updateInput();

        if(result === undefined)
            console.warn("updateInput is undefined")
        else
            this.editor.current.innerHTML = result.processed;

        //activeElement.innerHTML = innerHtml[0] + tool.getHtml(innerHtml[1]) + innerHtml[2];
    };

    getSelectionHtml() {
        var html = "";
        if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection();
            if (sel.rangeCount) {
                var container = document.createElement("div");
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                    container.appendChild(sel.getRangeAt(i).cloneContents());
                }
                html = container.innerHTML;
            }
        } else if (typeof document["selection"] != "undefined") {
            if (document["selection"].type == "Text") {
                html = document["selection"].createRange().htmlText;
            }
        }
        return html;
    };

    getTrimmedWindowSelectionRange() {
        const sel = window.getSelection();
        const text = sel.toString();
        const range = sel.getRangeAt(0);

        const startOffset = text.length - text.trimStart().length;
        const endOffset = text.length - text.trimEnd().length;

        if (startOffset) {
            range.setStart(range.startContainer, range.startOffset + startOffset);
        }

        if (endOffset) {
            range.setEnd(range.endContainer, range.endOffset - endOffset);
        }

        return sel;
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

        return this.props.inputDidUpdate(input);
    };

    onKeyDown(event) {
        if(event.key === "Tab") {
            event.preventDefault();

            const start = event.target.selectionStart;
            const end = event.target.selectionEnd;

            const tab = "&nbsp;&nbsp;&nbsp;&nbsp;";

            this.insertHtmlAtCaret(tab);

            event.target.selectionStart = event.target.selectionEnd = start + 4;
        }
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
                onKeyDown={(event) => this.onKeyDown(event)}
                onKeyUp={(event) => this.onKeyUp(event)}
                />
        );
    };
};
