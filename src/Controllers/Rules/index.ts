import OmitLineComments from "./omit-line-comments";
import EnableLineBreakElements from "./enable-line-break-element";
import EnableThematicBreakElements from "./enable-thematic-break-elements";
import EnableHeaderElements from "./enable-header-elements";
import EnableBoldAndItalicElements from "./enable-bold-and-italic-elements";
import EnableBoldElements from "./enable-bold-elements";
import EnableItalicElements from "./enable-italic-elements";
import EnableStrikethroughElements from "./enable-strikethrough-elements";
import EnableSuperscriptElements from "./enable-superscript-elements";
import EnableSubscriptElements from "./enable-subscript-elements";
import EnableBlocklistElements from "./enable-blocklist-elements";
import EnableBlocklistOrderedElements from "./enable-blocklist-ordered-elements";
import EnableBlockquoteElements from "./enable-blockquote-elements";
import EnableCodeblockElements from "./enable-codeblock-elements";
import EnableLinkElements from "./enable-link-elements";
import EnableImageElements from "./enable-image-elements"

// with consideration that default value of unset values will be "enabled" (true)
// all names should indicate an enablement of the rule where false disables the rule

// these are sorted by priority, e.g. a rule that has a syntax of **bold** should be before a rule with a syntax of *italic*
// in the future, we'll need an option to change the priority from the Edithor#rules property, for when the syntax is changed
// note that the priority order does not affect beforeHtmlEntities vs !beforeHtmlEntities states

// the reason they're an array of key - values is because objects do not have a specification defined order

export default [
    { key: "enable-line-break-element",         value: EnableLineBreakElements          },
    { key: "enable-header-elements",            value: EnableHeaderElements             },
    { key: "enable-bold-and-italic-elements",   value: EnableBoldAndItalicElements      },
    { key: "enable-bold-elements",              value: EnableBoldElements               },
    { key: "enable-strikethrough-elements",     value: EnableStrikethroughElements      },
    { key: "enable-italic-elements",            value: EnableItalicElements             },
    { key: "enable-thematic-break-element",     value: EnableThematicBreakElements      },
    { key: "enable-superscript-element",        value: EnableSuperscriptElements        },
    { key: "enable-subscript-element",          value: EnableSubscriptElements          },
    { key: "enable-blocklist-elements",         value: EnableBlocklistElements          },
    { key: "enable-blocklist-ordered-elements", value: EnableBlocklistOrderedElements   },
    { key: "enable-blockquote-elements",        value: EnableBlockquoteElements         },
    { key: "enable-codeblock-elements",         value: EnableCodeblockElements          },
    { key: "enable-image-elements",             value: EnableImageElements              },
    { key: "enable-link-elements",              value: EnableLinkElements               },
    { key: "omit-line-comments",                value: OmitLineComments                 },
];
