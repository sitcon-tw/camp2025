class ScrollToTop extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <button id="scrollToTopBtn" aria-label="Scroll to top">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
            </button>
        `;
    }
}

customElements.define('scroll-to-top', ScrollToTop); 