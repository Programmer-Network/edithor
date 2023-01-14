class EdithorColorElement extends HTMLSpanElement {
    static styleElement: HTMLElement | null = null;

    constructor() {
        super();
        
        if(EdithorColorElement.styleElement === null) {
            EdithorColorElement.styleElement = document.createElement("style");
            EdithorColorElement.styleElement.setAttribute("type", "text/css");
            
            EdithorColorElement.styleElement.innerHTML = `
                span[is="edithor-color"] {
                    color: var(--edithor-color);
                }

                span[is="edithor-color"]::before {
                    content: '';

                    display: inline-block;

                    height: .7em;
                    width: .7em;

                    margin: 0 .3em;

                    border-radius: 50%;

                    background-color: var(--edithor-color);
                }
            `;

            document.head.append(EdithorColorElement.styleElement);
        }
    }

    static get observedAttributes() {
        return [ "color" ];
    };

    attributeChangedCallback(key, previousValue, value) {
        if(key == "color")
            this.style.setProperty("--edithor-color", value);
    };
};

customElements.define("edithor-color", EdithorColorElement, { extends: "span" });
