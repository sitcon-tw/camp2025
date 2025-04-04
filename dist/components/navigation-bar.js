class NavigationBar extends HTMLElement {
    constructor() {
        super();
        const currentPath = window.location.pathname;
        const isHome = currentPath.endsWith('index.html') || currentPath.endsWith('/');
        const isCoc = currentPath.endsWith('coc.html');
        
        this.innerHTML = `
            <nav class="floating-nav">
                <a href="./index.html" class="${isHome ? 'current' : ''}">首頁</a>
                <a href="./coc.html" class="${isCoc ? 'current' : ''}">行為準則</a>
            </nav>
        `;
    }
}

customElements.define('navigation-bar', NavigationBar); 