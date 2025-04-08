class PjaxHandler {
    constructor() {
        this.contentContainer = document.getElementById('content') || document.querySelector('main');
        
        // If no content container found, create one
        if (!this.contentContainer) {
            const main = document.createElement('main');
            main.id = 'content';
            
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
                
                nodesToMove.forEach(node => main.appendChild(node));
                nav.insertAdjacentElement('afterend', main);
            } else {
                document.body.appendChild(main);
            }
            
            this.contentContainer = main;
        }
        
        // Create loading indicator style
        this.createLoadingStyle();
        
        // Initialize PJAX
        this.initializePjax();
        
        console.log('PJAX handler initialized');
    }
    
    initializePjax() {
        // Intercept all link clicks
        document.addEventListener('click', event => {
            const link = event.target.closest('a');
            
            // Check if the link exists, is internal, and isn't already handled
            if (link && 
                link.href && 
                link.hostname === window.location.hostname &&
                !link.hasAttribute('data-no-pjax') &&
                !link.getAttribute('target') &&
                !link.getAttribute('download') &&
                !(link.getAttribute('href') || '').startsWith('#')) {
                
                // Prevent default link behavior
                event.preventDefault();
                
                // Navigate to the new page
                this.navigateTo(link.href);
            }
        });
        
        // Handle back/forward browser navigation
        window.addEventListener('popstate', event => {
            if (event.state && event.state.url) {
                this.navigateTo(event.state.url, false);
            }
        });
        
        // Save initial state
        window.history.replaceState({ url: window.location.href }, document.title, window.location.href);
    }
    
    async navigateTo(url, pushState = true) {
        try {
            // Show loading indicator
            this.showLoading();
            
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
            const newContent = doc.getElementById('content') || doc.querySelector('main') || doc.body;
            
            // Update the page title
            document.title = doc.title;
            
            // Replace the content
            this.contentContainer.innerHTML = newContent.innerHTML;
            
            // Update URL in browser (only if not triggered by popstate)
            if (pushState) {
                window.history.pushState({ url }, document.title, url);
            }
            
            // Execute any scripts in the new content
            this.executeScripts(this.contentContainer);
            
            // Hide loading indicator
            this.hideLoading();
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            // Dispatch a custom event
            window.dispatchEvent(new CustomEvent('pjax:complete', { 
                detail: { url, title: document.title } 
            }));
        } catch (error) {
            console.error('PJAX navigation error:', error);
            // Fallback to traditional navigation on error
            window.location.href = url;
        }
    }
    
    executeScripts(container) {
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
        
        // Re-initialize any web components if needed
        this.reinitializeComponents();
    }
    
    reinitializeComponents() {
        // Look for custom web components that might need initialization
        const components = this.contentContainer.querySelectorAll('*');
        components.forEach(el => {
            // Check if it's a custom element that might need initialization
            if (el.tagName && el.tagName.includes('-')) {
                // Force re-render if the component has a render method
                if (typeof el.render === 'function') {
                    el.render();
                }
                
                // Dispatch a custom event that components can listen for
                el.dispatchEvent(new CustomEvent('component:reinitialize', { 
                    bubbles: true,
                    detail: { pjax: true }
                }));
            }
        });
    }
    
    createLoadingStyle() {
        if (!document.getElementById('pjax-loading-style')) {
            const style = document.createElement('style');
            style.id = 'pjax-loading-style';
            style.textContent = `
                #pjax-loading {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 3px;
                    background: rgba(66, 133, 244, 0.2);
                    z-index: 9999;
                    overflow: hidden;
                }
                
                #pjax-loading::after {
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
                
                .pjax-transition {
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
    
    showLoading() {
        // Create loading indicator if it doesn't exist
        if (!document.getElementById('pjax-loading')) {
            const loader = document.createElement('div');
            loader.id = 'pjax-loading';
            document.body.appendChild(loader);
        } else {
            document.getElementById('pjax-loading').style.display = 'block';
        }
        
        this.contentContainer.classList.add('pjax-transition');
    }
    
    hideLoading() {
        const loader = document.getElementById('pjax-loading');
        if (loader) {
            loader.style.display = 'none';
        }
    }
}

// Initialize PJAX when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.pjaxHandler = new PjaxHandler();
});

// Make it available as a custom element for easier integration
class PjaxElement extends HTMLElement {
    connectedCallback() {
        if (!window.pjaxHandler) {
            window.pjaxHandler = new PjaxHandler();
        }
    }
}

customElements.define('pjax-handler', PjaxElement); 