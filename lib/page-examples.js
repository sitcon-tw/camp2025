/**
 * Example of how to register new pages with the PJAX system
 * 
 * This demonstrates how easy it is to add new pages without modifying existing code.
 * You can include this file in your HTML or import it in another JavaScript file.
 */

// Wait for DOM and the PageRegistry to be available
document.addEventListener('DOMContentLoaded', () => {
    if (!window.PageRegistry) {
        console.error('PageRegistry not found. Make sure pjax-handler.js is loaded first.');
        return;
    }
    
    // Example: Register a new about page
    window.PageRegistry.registerPage('/about.html', {
        title: 'About Us',
        onLoad: ({ container }) => {
            console.log('About page loaded');
            
            // You could run specific code for this page here
            // For example, initialize a map or load dynamic content
            const mapElements = container.querySelectorAll('.interactive-map');
            if (mapElements.length > 0) {
                // Initialize map library
                console.log('Map elements found, would initialize maps here');
            }
        },
        onUnload: ({ container }) => {
            console.log('Leaving about page');
            // Clean up any resources when navigating away
        }
    });
    
    // Example: Register a blog listing page with dynamic content loading
    window.PageRegistry.registerPage('/blog.html', {
        title: 'Blog',
        onLoad: async ({ container }) => {
            console.log('Blog page loaded');
            
            // Example of loading blog posts dynamically
            const blogContainer = container.querySelector('.blog-posts');
            if (blogContainer) {
                try {
                    // You could fetch blog posts from an API
                    blogContainer.innerHTML = '<p>Loading blog posts...</p>';
                    
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    // Update content
                    blogContainer.innerHTML = `
                        <article>
                            <h2>First Blog Post</h2>
                            <p>This would be loaded dynamically when the page loads via PJAX</p>
                        </article>
                        <article>
                            <h2>Second Blog Post</h2>
                            <p>Another example of dynamic content that's only loaded when needed</p>
                        </article>
                    `;
                } catch (error) {
                    console.error('Error loading blog posts:', error);
                    blogContainer.innerHTML = '<p>Error loading posts. Please try again later.</p>';
                }
            }
        }
    });
    
    // Example: Register a contact form page with form handling
    window.PageRegistry.registerPage('/contact.html', {
        title: 'Contact Us',
        onLoad: ({ container }) => {
            console.log('Contact page loaded');
            
            // Find and initialize contact form
            const form = container.querySelector('#contact-form');
            if (form) {
                form.addEventListener('submit', (event) => {
                    event.preventDefault();
                    console.log('Form submitted');
                    
                    // Example form handling
                    const formData = new FormData(form);
                    const data = {};
                    for (let [key, value] of formData.entries()) {
                        data[key] = value;
                    }
                    
                    console.log('Form data:', data);
                    alert('Thank you for your message! We will get back to you soon.');
                    form.reset();
                });
            }
        }
    });
}); 