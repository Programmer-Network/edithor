import React, { Component } from "react";
import Editor from "./Components/Editor";
import Renderer from "./Components/Renderer";
import EdithorRule from "./Types/EdithorRule";
import Rules from "./Controllers/Rules";

import "./polyfill.js";
import Highlighter from "./Controllers/Highlighter";

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

    componentDidMount(): void {
        Highlighter.getHighlighterAsync().then(() => this.rulesDidUpdate());
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

        const raw = this.props.input;

        // here we would implement our custom logic to set the "rules" state
        // e.g. define that we're in a code block now

        // for safety, I think the process should be like this:
        // eject the code blocks (e.g. ```(.*?)```) and process the sections individually
        // e.g. first everything up to the first code block opening, then the code block itself, then everything below
        //      the code block closing, the code block obviously being N
        // this is only a special scenario since code blocks contains code, unlike the rest of the content which is just text and markup

        // this is what the "difficult" task will be, mostly due to performance concerns

        const sections = [];

        let text = raw.replaceAll('\r', ''), newLine = true, codeBlock = false, codeSyntax;

        for(let index = 0; index < text.length; index++) {
            if(newLine) {
                newLine = false;

                if(text.substring(index, index + 3) === '```') {
                    if(!codeBlock) {
                        sections.push({
                            codeBlock,
                            text: text.substring(0, index)
                        });

                        codeBlock = true;

                        text = text.substring(index + 3, text.length);
                        index = 0;
                        
                        for(let newLineIndex = 0; newLineIndex < text.length; newLineIndex++) {
                            if(text[newLineIndex] === '\n') {
                                codeSyntax = text.substring(0, newLineIndex);
                                text = text.substring(newLineIndex, text.length);

                                break;
                            }
                        }
                    }
                    else {
                        sections.push({
                            codeBlock,
                            codeSyntax,
                            text: text.substring(0, index)
                        });

                        codeBlock = false;

                        text = text.substring(index + 3, text.length);
                        index = 0;
                    }
                }
            }

            if(text[index] === '\n')
                newLine = true;
        }

        if(text.length !== 0) {
            sections.push({
                codeBlock: false,
                text
            });
        }

        const missingCodeSyntax: string[] = [];

        const processed = sections.map((section) => {
            let processed: string = section.text;

            if(section.codeBlock) {
                if(section.codeSyntax.length === 0)
                    section.codeSyntax = "txt";

                if(!Highlighter.hasSyntax(section.codeSyntax)) {
                    Highlighter.holdSyntax(section.codeSyntax);

                    missingCodeSyntax.push(section.codeSyntax);

                    console.log("missing syntax " + section.codeSyntax);

                    section.codeSyntax = "txt";
                }
                else
                    section.codeSyntax = Highlighter.getSyntax(section.codeSyntax);
            }

            let rules = this.state?.rules.filter((rule) => {
                if(!!rule.conditions?.beforeHtmlEntities === false)
                    return false;

                if(!!rule.conditions?.codeBlock !== section.codeBlock)
                    return false;

                return true;
            });

            rules.forEach((rule) => processed = rule.process(processed, section));

            // this turns _every non-digit/English alphabetic_ character into a HTML entity
            // this is perfectly reasonable. it will not affect network bandwidth - this is client code
            // and it's a perfect XSS prevention.

            // in all our rules, because of this, we use the HTML entities to decode character
            // such as line feeds (\n) and carriage returns (\r)

            // we'll skip code blocks for this

            if(!section.codeBlock) {
                processed = processed.replaceAll(
                    /[^0-9A-Za-z ]/g,
                    c => "&#" + c.charCodeAt(0) + ";"
                );
            }

            rules = this.state?.rules.filter((rule) => {
                if(!!rule.conditions?.beforeHtmlEntities === true)
                    return false;

                if(!!rule.conditions?.codeBlock !== section.codeBlock)
                    return false;

                return true;
            });

            rules.forEach((rule) => processed = rule.process(processed, section));

            return processed;
        });

        if(missingCodeSyntax.length) {
            Promise.all(missingCodeSyntax.map(async (syntax: string) => {
                await Highlighter.getSyntaxAsync(syntax);
            })).then(() => {
                this.inputDidUpdate();
            });
        }

        // once it's processed, pass it over to our child components - as props
        // see comments at the top about the child components not being in control of the Edithor™ states

        this.setState({
            edithor: {
                raw: this.props.input,
                processed: processed.join('')
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
