import OmitLineComments from "./omit-line-comments";
import EnableLineBreakElements from "./enable-line-break-element";
import EnableHeaderElements from "./enable-header-elements";

// with consideration that default value of unset values will be "enabled" (true)
// all names should indicate an enablement of the rule where false disables the rule

export default {
    "omit-line-comments": OmitLineComments,
    "enable-line-break-element": EnableLineBreakElements,
    "enable-header-elements": EnableHeaderElements
};
