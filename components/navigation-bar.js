class NavigationBar extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <nav class="floating-nav">
                <a href="./index.html">首頁</a>
                <a href="./coc.html">行為準則</a>
            </nav>
        `;
    }
}

customElements.define('navigation-bar', NavigationBar); 