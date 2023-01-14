import React, { Component } from "react";
import Editor from "./Components/Editor";
import Renderer from "./Components/Renderer";
import EdithorRule from "./Types/EdithorRule";
import Rules from "./Controllers/Rules";

import "./polyfill.js";
import Highlighter from "./Controllers/Highlighter";
import { getMarkdownSections, getProcessedMarkdown } from "./Controllers/Parser";

type EdithorProps = {
    input: string,
    children: React.ReactNode[],

    debug?: "info" | "all" | boolean,
    rules?: {[key: string]: boolean | object}
};

type EdithorComponentState = {
    // this is the only object that the children have access to
    edithor: EdithorState,

    // these are states that our child components have no use of knowing about
    // e.g. they should not rely on any rules of any kind
    rules: EdithorRule[]
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

    rules: EdithorRule[];

    promise = null;

    componentDidMount(): void {
        if(this.promise !== null)
            return;
        
        this.promise = Highlighter.getHighlighterAsync().then(() => this.rulesDidUpdate());
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

            this.inputDidUpdate();
        }
    };

    rulesDidUpdate() {
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

        this.setState({
            rules: filteredRules.map(({ key, value }) => {
                let options = null;
                
                if(this.props.rules) {
                    if(typeof this.props.rules[key] === "object")
                        options = this.props.rules[key];
                    else 
                        options = this.props.rules["*"] ?? null;
                }

                return new value(options);
            })
        }, () => {
            this.props.debug === "all" && console.debug("Edithor processing rules:", performance.now() - timestamp);
            
            this.inputDidUpdate();
        });
    };

    inputDidUpdate() {
        const timestamp = performance.now();

        const sections = getMarkdownSections(this.props.input);
        const processed = getProcessedMarkdown(sections, this.state?.rules);

        if(processed.missingLanguages.length) {
            Promise.all(processed.missingLanguages.flatMap(async (syntax: string) => {
                await Highlighter.getSyntaxAsync(syntax);
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
                raw: this.props.input,
                processed: processed.text
            }
        }, () => {
            this.props.debug === "all" && console.debug("Edithor processing input:", performance.now() - timestamp);
        });
    };

    render() {
        /// TODO: this shouldn't be necessary
        if(!this.state)
            return null;

        const children = React.Children.map(this.props.children, (child) => {
            if(React.isValidElement(child))
                return React.cloneElement(child, { edithor: this.state.edithor } as any);
            
            return child;
        });

        this.props.debug === "all" && console.debug("Edithor rendered with children: ", children);

        return children;
    };
};
