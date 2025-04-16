class NavigationBar extends HTMLElement {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('sitcon-lang') || 'zh';
        this.render();
        
        // Listen for PJAX navigation events to update active state
        window.addEventListener('pjax:complete', (event) => {
            this.updateActiveState(event.detail.url);
        });
    }
    
    updateActiveState(url) {
        const currentPath = new URL(url, window.location.origin).pathname;
        const isHome = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath.endsWith('index_en.html');
        const isCoc = currentPath.endsWith('coc.html') || currentPath.endsWith('coc_en.html');
        const isEnglish = currentPath.includes('_en');
        
        // Update language preference
        if (isEnglish && this.currentLang !== 'en') {
            this.currentLang = 'en';
            localStorage.setItem('sitcon-lang', 'en');
        } else if (!isEnglish && this.currentLang !== 'zh') {
            this.currentLang = 'zh';
            localStorage.setItem('sitcon-lang', 'zh');
        }
        
        const links = this.querySelectorAll('nav a');
        links.forEach(link => {
            const linkPath = new URL(link.href, window.location.origin).pathname;
            
            if ((isHome && (linkPath.endsWith('index.html') || linkPath.endsWith('index_en.html'))) || 
                (isCoc && (linkPath.endsWith('coc.html') || linkPath.endsWith('coc_en.html')))) {
                link.classList.add('current');
            } else {
                link.classList.remove('current');
            }
        });
    }
    
    toggleLanguage() {
        this.currentLang = this.currentLang === 'zh' ? 'en' : 'zh';
        localStorage.setItem('sitcon-lang', this.currentLang);
        
        // Get current page path and redirect to equivalent in other language
        const currentPath = window.location.pathname;
        let newPath;
        
        if (this.currentLang === 'en') {
            // Switch to English
            if (currentPath.endsWith('index.html') || currentPath.endsWith('/')) {
                newPath = './index_en.html';
            } else if (currentPath.endsWith('coc.html')) {
                newPath = './coc_en.html';
            } else {
                newPath = './index_en.html'; // Default fallback
            }
        } else {
            // Switch to Chinese
            if (currentPath.endsWith('index_en.html')) {
                newPath = './index.html';
            } else if (currentPath.endsWith('coc_en.html')) {
                newPath = './coc.html';
            } else {
                newPath = './index.html'; // Default fallback
            }
        }
        
        window.location.href = newPath;
    }
    
    render() {
        const currentPath = window.location.pathname;
        const isHome = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath.endsWith('index_en.html');
        const isCoc = currentPath.endsWith('coc.html') || currentPath.endsWith('coc_en.html');
        const isEnglish = currentPath.includes('_en') || this.currentLang === 'en';
        
        // Update this.currentLang based on URL if needed
        if (isEnglish && this.currentLang !== 'en') {
            this.currentLang = 'en';
            localStorage.setItem('sitcon-lang', 'en');
        }
        
        const homeUrl = this.currentLang === 'zh' ? './index.html' : './index_en.html';
        const cocUrl = this.currentLang === 'zh' ? './coc.html' : './coc_en.html';
        
        this.innerHTML = `
            <nav class="floating-nav">
                <a href="${homeUrl}" class="${isHome ? 'current' : ''}">${this.currentLang === 'zh' ? '首頁' : 'Home'}</a>
                <a href="${cocUrl}" class="${isCoc ? 'current' : ''}">${this.currentLang === 'zh' ? '行為準則' : 'Code of Conduct'}</a>
                <a href="#" class="lang-switch" id="lang-toggle">${this.currentLang === 'zh' ? 'English' : '中文'}</a>
            </nav>
        `;
        
        // Add event listener for language toggle
        setTimeout(() => {
            const langToggle = this.querySelector('#lang-toggle');
            if (langToggle) {
                langToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleLanguage();
                });
            }
        }, 0);
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
            ['/', '/index.html', '/index_en.html', '/coc.html', '/coc_en.html'].forEach(path => {
                window.PageRegistry.registerPage(path, {
                    onLoad: ({ path }) => {
                        updateNavigation(path);
                    }
                });
            });
        }
    });
} 