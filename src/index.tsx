import React, { Component, ReactElement, RefObject } from "react";
import Editor, { EditorProps } from "./Components/Editor";
import Renderer, { RendererProps } from "./Components/Renderer";
import EdithorRule from "./Types/EdithorRule";
import Rules from "./Controllers/Rules";
import Highlighter from "./Controllers/Highlighter";
import { MarkdownParser } from "./Controllers/Parser";

import "./polyfill.js";
import "./Edithor.min.css";

type EdithorProps = {
    input: string,
    children: React.ReactNode[],

    debug?: "info" | "all" | boolean,
    rules?: {[key: string]: boolean | object}
};

type EdithorComponentState = {
    // this is the only object that the children have access to
    edithor: EdithorState
};

// the state we're refering to is not the React component state, this Edithor component should not
// have any states since it's more of a placeholder, think of it as a React Fragment 
export type EdithorState = {
    // raw means the same as EdithorProps#input, this is redundant but might be useful in the future, right now
    // it's here for coding context only
    raw: string,

    processed: string
};

export default class Edithor extends Component<EdithorProps, EdithorComponentState> {
    static Editor = Editor;
    static Renderer = Renderer;

    promise = null;

    editor: RefObject<Editor>;

    rules: EdithorRule[];

    constructor(props: any) {
        super(props);

        this.editor = React.createRef();
    };
    
    componentDidMount(): void {
        if(this.promise !== null)
            return;
        
        this.promise = Highlighter.getHighlighterAsync().then(() => this.rulesDidUpdate(this.props.input));
    };

    componentDidUpdate(previousProps: Readonly<EdithorProps>): void {
        // TODO: maybe revisit JSON.stringify() === JSON.stringify(), maybe not

        // updating the rules also updates the input afterwards
        if(JSON.stringify(previousProps.rules) !== JSON.stringify(this.props.rules)) {
            this.props.debug === "all" && console.warn("Edithor rules has been changed.");

            this.rulesDidUpdate();
        }
        else if(previousProps.input !== this.props.input) {
            this.props.debug === "all" && console.warn("Edithor input has been changed.");

            this.inputDidUpdate(this.props.input, true);
        }
    };

    rulesDidUpdate(input?: string) {
        const timestamp = performance.now();

        const filteredRules: { key, value }[] = Rules.filter(({ key, value }) => {
            if(!this.props.rules)
                return true;

            let rule = null;

            if(this.props.rules[key] === undefined) {
                if(this.props.rules["*"] === undefined)
                    return true;

                rule = this.props.rules["*"];
            }
            else
                rule = this.props.rules[key];

            const type: string = typeof rule;

            if(type === "boolean")
                return !!rule;

            if(type === "object")
                return rule["enabled"];

            // we should never get to this state, and it's only possible in regular js
            throw new Error(`Edithor rule ${key} has an invalid value type of ${type}.`);
        });

        this.props.debug && console.debug("Edithor enabled rules: ", filteredRules);

        // intialize the rules and then emulate an input change to cause a refresh in the child components
        // because the child components are not aware of the rules.

        this.rules = filteredRules.map(({ key, value }) => {
            let options = null;
            
            if(this.props.rules) {
                if(typeof this.props.rules[key] === "object")
                    options = this.props.rules[key];
                else 
                    options = this.props.rules["*"] ?? null;
            }

            return new value(options);
        });

        this.props.debug === "all" && console.debug("Edithor processing rules:", performance.now() - timestamp);
        
        this.inputDidUpdate(input);
    };

    inputDidUpdate(newInput?: string, refreshEditor?: boolean) {
        const raw: string = newInput ?? this.state.edithor?.raw;

        const timestamp = performance.now();

        const sections = MarkdownParser.getSections(raw);
        const processed = MarkdownParser.parse(sections, this.rules);

        if(processed.missingLanguages.length) {
            Promise.all(processed.missingLanguages.flatMap(async (language: string) => {
                await Highlighter.loadLanguageAsync(language);
            }))
            .then(() => {
                this.props.debug === "all" && console.debug("Edithor input languages has been loaded.");

                this.inputDidUpdate();
            });
        }

        // once it's processed, pass it over to our child components - as props
        // see comments at the top about the child components not being in control of the Edithor™ states

        this.setState({
            edithor: {
                raw: raw,
                processed: processed.text
            }
        }, () => {
            this.props.debug === "all" && console.debug("Edithor processing input:", performance.now() - timestamp);

            if(this.editor?.current && (!this.editor.current.hasEdithor() || refreshEditor))
                this.editor.current.setEdithor(this.state.edithor, (input) => this.inputDidUpdate(input));
        });
    };

    render() {
        /// TODO: this shouldn't be necessary
        if(!this.state)
            return null;

        let editorCount: number = 0;

        const children = React.Children.map(this.props.children, (child) => {
            if(React.isValidElement(child)) {
                if(child.type === Editor) {
                    editorCount++;

                    if(editorCount > 1)
                        throw new Error("more than 1 editor will cause desynchronization rn, might fix soon.");

                    const props: EditorProps = {
                        ref: this.editor,
                        rules: this.rules,
                        edithor: this.state?.edithor,
                        
                        ...child.props
                    };

                    return React.cloneElement(child, props);
                }

                if(child.type === Renderer)
                    return React.cloneElement(child, { edithor: this.state.edithor } as RendererProps);
            }
            
            return child;
        });

        this.props.debug === "all" && console.debug("Edithor rendered with children: ", children);

        return children;
    };
};
