/**
 * PJAX (PushState + AJAX) handler for smooth page transitions
 * Follows more SOLID principles:
 * - Single Responsibility: Separates concerns into Config, Navigator, DOM Handler
 * - Open-Closed: Can be extended with new page handlers without modifying core code
 * - Dependency Inversion: Uses events to communicate between components
 */

// Configuration object that can be customized
const PjaxConfig = {
    contentSelector: '#content',
    navLinkSelector: 'a:not([data-no-pjax]):not([target]):not([download])',
    loadingBarId: 'pjax-loading',
    transitionClass: 'pjax-transition',
    eventNames: {
        complete: 'pjax:complete',
        beforeReplace: 'pjax:before-replace',
        afterReplace: 'pjax:after-replace',
        reinitialize: 'component:reinitialize'
    }
};

// DOM manipulation utility
class DomHandler {
    static getContentContainer() {
        return document.getElementById(PjaxConfig.contentSelector.replace('#', '')) || 
               document.querySelector(PjaxConfig.contentSelector) || 
               document.querySelector('main');
    }
    
    static createContentContainerIfNeeded() {
        let container = this.getContentContainer();
        
        if (!container) {
            container = document.createElement('main');
            container.id = PjaxConfig.contentSelector.replace('#', '');
            
            // Move all content between navigation-bar and site-footer into the main container
            const nav = document.querySelector('navigation-bar');
            const footer = document.querySelector('site-footer');
            
            if (nav && footer) {
                let currentNode = nav.nextSibling;
                const nodesToMove = [];
                
                while (currentNode && currentNode !== footer) {
                    if (currentNode.nodeType === 1) { // Element node
                        nodesToMove.push(currentNode);
                    }
                    currentNode = currentNode.nextSibling;
                }
                
                nodesToMove.forEach(node => container.appendChild(node));
                nav.insertAdjacentElement('afterend', container);
            } else {
                document.body.appendChild(container);
            }
        }
        
        return container;
    }
    
    static executeScripts(container) {
        // Find and execute any scripts
        const scripts = container.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            
            // Copy all attributes
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            
            // Copy the content
            newScript.innerHTML = oldScript.innerHTML;
            
            // Replace the old script with the new one
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    }
    
    static reinitializeComponents(container) {
        // Look for custom web components that might need initialization
        const components = container.querySelectorAll('*');
        components.forEach(el => {
            // Check if it's a custom element that might need initialization
            if (el.tagName && el.tagName.includes('-')) {
                // Force re-render if the component has a render method
                if (typeof el.render === 'function') {
                    el.render();
                }
                
                // Dispatch a custom event that components can listen for
                el.dispatchEvent(new CustomEvent(PjaxConfig.eventNames.reinitialize, { 
                    bubbles: true,
                    detail: { pjax: true }
                }));
            }
        });
    }
}

// Loading indicator handler
class LoadingIndicator {
    static createStyles() {
        if (!document.getElementById(`${PjaxConfig.loadingBarId}-style`)) {
            const style = document.createElement('style');
            style.id = `${PjaxConfig.loadingBarId}-style`;
            style.textContent = `
                #${PjaxConfig.loadingBarId} {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 3px;
                    background: rgba(66, 133, 244, 0.2);
                    z-index: 9999;
                    overflow: hidden;
                }
                
                #${PjaxConfig.loadingBarId}::after {
                    content: '';
                    display: block;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 25%;
                    height: 100%;
                    background: #4285f4;
                    animation: pjax-loading 1s infinite cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                @keyframes pjax-loading {
                    0% {
                        left: -25%;
                    }
                    50% {
                        left: 100%;
                    }
                    100% {
                        left: 100%;
                    }
                }
                
                .${PjaxConfig.transitionClass} {
                    animation: pjax-fadein 0.3s ease-out;
                }
                
                @keyframes pjax-fadein {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    static show(container) {
        // Create loading indicator if it doesn't exist
        if (!document.getElementById(PjaxConfig.loadingBarId)) {
            const loader = document.createElement('div');
            loader.id = PjaxConfig.loadingBarId;
            document.body.appendChild(loader);
        } else {
            document.getElementById(PjaxConfig.loadingBarId).style.display = 'block';
        }
        
        if (container) {
            container.classList.add(PjaxConfig.transitionClass);
        }
    }
    
    static hide() {
        const loader = document.getElementById(PjaxConfig.loadingBarId);
        if (loader) {
            loader.style.display = 'none';
        }
    }
}

// Page registry - centralized place to register and manage pages
class PageRegistry {
    static pages = {};
    
    static registerPage(path, options = {}) {
        // Ensure paths start with slash
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        this.pages[normalizedPath] = {
            onLoad: options.onLoad || (() => {}),
            onUnload: options.onUnload || (() => {}),
            ...options
        };
    }
    
    static getPageHandler(path) {
        // Normalize path to match registration
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        return this.pages[normalizedPath] || this.pages['/'] || null;
    }
    
    static init() {
        // Register default home page if not registered
        if (!this.pages['/']) {
            this.registerPage('/', {
                title: 'Home'
            });
        }
        
        // Add other default pages if needed
        if (!this.pages['/index.html']) {
            this.registerPage('/index.html', {
                title: 'Home'
            });
        }
        
        // Register default coc page if not registered
        if (!this.pages['/coc.html']) {
            this.registerPage('/coc.html', {
                title: 'Code of Conduct'
            });
        }
    }
}

// Main PJAX navigator
class PjaxNavigator {
    constructor() {
        this.contentContainer = DomHandler.createContentContainerIfNeeded();
        
        // Create loading indicator styles
        LoadingIndicator.createStyles();
        
        // Initialize page registry
        PageRegistry.init();
        
        // Initialize PJAX
        this.initializeEventListeners();
        
        // Save initial state
        const initialUrl = window.location.href;
        const initialPath = window.location.pathname;
        window.history.replaceState({ 
            url: initialUrl, 
            path: initialPath 
        }, document.title, initialUrl);
        
        // Execute any page-specific initialization for current page
        const currentPage = PageRegistry.getPageHandler(initialPath);
        if (currentPage && typeof currentPage.onLoad === 'function') {
            currentPage.onLoad({ 
                container: this.contentContainer, 
                url: initialUrl, 
                path: initialPath 
            });
        }
        
        console.log('PJAX navigator initialized');
    }
    
    initializeEventListeners() {
        // Intercept all link clicks
        document.addEventListener('click', this.handleLinkClick.bind(this));
        
        // Handle back/forward browser navigation
        window.addEventListener('popstate', this.handlePopState.bind(this));
    }
    
    handleLinkClick(event) {
        const link = event.target.closest(PjaxConfig.navLinkSelector);
        
        // Check if the link exists and is internal
        if (link && 
            link.href && 
            link.hostname === window.location.hostname &&
            !(link.getAttribute('href') || '').startsWith('#')) {
            
            // Prevent default link behavior
            event.preventDefault();
            
            // Navigate to the new page
            this.navigateTo(link.href);
        }
    }
    
    handlePopState(event) {
        if (event.state && event.state.url) {
            this.navigateTo(event.state.url, false);
        }
    }
    
    async navigateTo(url, pushState = true) {
        try {
            // Parse URL to get pathname for page handler lookup
            const urlObj = new URL(url, window.location.origin);
            const path = urlObj.pathname;
            
            // Get the page handler
            const pageHandler = PageRegistry.getPageHandler(path);
            
            // Execute unload callback for current page if exists
            const currentPath = window.location.pathname;
            const currentPage = PageRegistry.getPageHandler(currentPath);
            if (currentPage && typeof currentPage.onUnload === 'function') {
                currentPage.onUnload({ 
                    container: this.contentContainer, 
                    url: window.location.href, 
                    path: currentPath
                });
            }
            
            // Show loading indicator
            LoadingIndicator.show(this.contentContainer);
            
            // Fetch the new page content
            const response = await fetch(url, { 
                headers: {
                    'X-Requested-With': 'XMLHttpRequest' 
                }
            });
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const html = await response.text();
            
            // Create a temporary element to parse the HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract the main content
            const newContent = doc.getElementById(PjaxConfig.contentSelector.replace('#', '')) || 
                              doc.querySelector(PjaxConfig.contentSelector) || 
                              doc.querySelector('main') || 
                              doc.body;
            
            // Dispatch before-replace event
            window.dispatchEvent(new CustomEvent(PjaxConfig.eventNames.beforeReplace, { 
                detail: { url, path, content: newContent }
            }));
            
            // Update the page title
            document.title = doc.title;
            
            // Replace the content
            this.contentContainer.innerHTML = newContent.innerHTML;
            
            // Update URL in browser (only if not triggered by popstate)
            if (pushState) {
                window.history.pushState({ url, path }, document.title, url);
            }
            
            // Execute scripts and initialize components
            DomHandler.executeScripts(this.contentContainer);
            DomHandler.reinitializeComponents(this.contentContainer);
            
            // Hide loading indicator
            LoadingIndicator.hide();
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            // Execute page-specific load callback if exists
            if (pageHandler && typeof pageHandler.onLoad === 'function') {
                pageHandler.onLoad({ 
                    container: this.contentContainer, 
                    url, 
                    path 
                });
            }
            
            // Dispatch complete event
            window.dispatchEvent(new CustomEvent(PjaxConfig.eventNames.complete, { 
                detail: { url, path, title: document.title }
            }));
            
            // Dispatch after-replace event
            window.dispatchEvent(new CustomEvent(PjaxConfig.eventNames.afterReplace, { 
                detail: { url, path }
            }));
        } catch (error) {
            console.error('PJAX navigation error:', error);
            // Fallback to traditional navigation on error
            window.location.href = url;
        }
    }
}

// Initialize PJAX when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.pjaxNavigator = new PjaxNavigator();
});

// Example of registering custom page handlers
PageRegistry.registerPage('/', {
    onLoad: ({container}) => {
        console.log('Home page loaded');
        // Any special initialization for home page
    }
});

PageRegistry.registerPage('/coc.html', {
    onLoad: ({container}) => {
        console.log('Code of Conduct page loaded');
        // Any special initialization for CoC page
    }
});

// Make it available as a custom element for easier integration
class PjaxElement extends HTMLElement {
    connectedCallback() {
        if (!window.pjaxNavigator) {
            window.pjaxNavigator = new PjaxNavigator();
        }
    }
}

customElements.define('pjax-handler', PjaxElement); 