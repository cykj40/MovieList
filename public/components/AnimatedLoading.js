export class AnimatedLoading extends HTMLElement {
    connectedCallback() {
        const elements = this.dataset.elements || 10;

        for (let i = 0; i < elements; i++) {
            const wrapper = document.createElement("div");
            wrapper.classList.add("loading-wave");
            wrapper.style.animationDelay = `${i * 0.1}s`; // Subtle stagger
            this.appendChild(wrapper);
        }
    }
}


customElements.define("animated-loading", AnimatedLoading);