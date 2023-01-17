import EdithorRule from "../../Types/EdithorRule";
import EdithorRuleConditions from "../../Types/EdithorRuleConditions";
import Utils from "../Utils";

import "./../Elements/EdithorColorElement";

type EnableColorElementsOptions = {
    syntax?: string | string[]
};

const dot = Utils.getEncodedCharacter('.');
const comma = Utils.getEncodedCharacter(',');
const percentage = Utils.getEncodedCharacter('%');
const hash = Utils.getEncodedCharacter('#');

const paranthesesOpen = Utils.getEncodedCharacter('(');
const paranthesesClose = Utils.getEncodedCharacter(')');

const hexRegExp     = `(${hash}[A-Fa-f0-9]{3}(?:[A-Fa-f0-9]{3})?)`;
const hslRegExp     = `((?:hsl(?:a)?|HSL(?:A)?)${paranthesesOpen}[0-9]{1,3}(?:${comma})? [0-9]{1,3}${percentage}(?:${comma})? [0-9]{1,3}${percentage}(?:(?:${comma})? \\d*${dot}?\\d*)?${paranthesesClose})`;
const rgbRegExp     = `((?:rgb|RGB)${paranthesesOpen}[0-9]{1,3}${comma} [0-9]{1,3}${comma} [0-9]{1,3}${paranthesesClose})`;
const rgbaRegExp    = `((?:rgba|RGBA)${paranthesesOpen}[0-9]{1,3}${comma} [0-9]{1,3}${comma} [0-9]{1,3}${comma} \\d*${dot}?\\d*${paranthesesClose})`;

const regExp = new RegExp(`${hexRegExp}|${hslRegExp}|${rgbRegExp}|${rgbaRegExp}`, 'g');

export default class EnableColorElements implements EdithorRule {
    options: EnableColorElementsOptions;
    
    constructor(options?: EnableColorElementsOptions) {
        this.options = options;
    };

    conditions: EdithorRuleConditions;

    parseMarkdown(input: string): string {
        return input.replaceAll(regExp, (match) => {
            return `<span is="edithor-color" color="${match}">${match}</span>`;
        });
    };
};

