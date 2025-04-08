class NavigationBar extends HTMLElement {
    constructor() {
        super();
        this.render();
        
        // Listen for PJAX navigation events to update active state
        window.addEventListener('pjax:complete', (event) => {
            this.updateActiveState(event.detail.url);
        });
    }
    
    updateActiveState(url) {
        const currentPath = new URL(url, window.location.origin).pathname;
        const isHome = currentPath.endsWith('index.html') || currentPath.endsWith('/');
        const isCoc = currentPath.endsWith('coc.html');
        
        const links = this.querySelectorAll('nav a');
        links.forEach(link => {
            const linkPath = new URL(link.href, window.location.origin).pathname;
            
            if ((isHome && linkPath.endsWith('index.html')) || 
                (isCoc && linkPath.endsWith('coc.html'))) {
                link.classList.add('current');
            } else {
                link.classList.remove('current');
            }
        });
    }
    
    render() {
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

// Register this component with the PageRegistry for state management
if (window.PageRegistry) {
    const updateNavigation = (path) => {
        const navbars = document.querySelectorAll('navigation-bar');
        navbars.forEach(navbar => {
            if (navbar.updateActiveState) {
                navbar.updateActiveState(path);
            }
        });
    };
    
    // Listen for page registration
    document.addEventListener('DOMContentLoaded', () => {
        if (window.PageRegistry) {
            // Register handler for all pages
            ['/', '/index.html', '/coc.html'].forEach(path => {
                window.PageRegistry.registerPage(path, {
                    onLoad: ({ path }) => {
                        updateNavigation(path);
                    }
                });
            });
        }
    });
} 