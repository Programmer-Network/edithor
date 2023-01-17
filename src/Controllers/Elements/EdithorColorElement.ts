class EdithorColorElement extends HTMLSpanElement {
    static get observedAttributes() {
        return [ "color" ];
    };

    attributeChangedCallback(key, previousValue, value) {
        if(key == "color")
            this.style.setProperty("--edithor-color", value);
    };
};

customElements.define("edithor-color", EdithorColorElement, { extends: "span" });
