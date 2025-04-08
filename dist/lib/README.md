# PJAX Navigation System

This library provides a smooth, SPA-like navigation experience with browser history support, while being highly extensible and following SOLID principles.

## Features

- Fast, smooth page transitions without full page reloads
- Automatic execution of JavaScript in the loaded content
- Preserves browser history and back/forward navigation
- Loading indicator for better user experience
- Properly handles and reinitializes web components
- Follows SOLID principles for better maintainability

## Integration

1. Include the script in your HTML:

```html
<script type="module" src="./lib/pjax-handler.js"></script>
```

2. Add the custom element to your HTML:

```html
<pjax-handler></pjax-handler>
```

3. Ensure your page structure has:
   - A `<main id="content">` element containing the page content
   - A consistent HTML structure across pages

## Adding New Pages

The PJAX system makes it easy to add new pages without modifying existing code. Each page can have its own:

- Custom initialization logic
- Cleanup logic when navigating away
- Custom event handlers

Example:

```javascript
// Register a new page with the PageRegistry
PageRegistry.registerPage('/new-page.html', {
    title: 'New Page',
    onLoad: ({ container, path }) => {
        console.log('New page loaded');
        // Initialize page-specific elements here
    },
    onUnload: ({ container }) => {
        console.log('Leaving new page');
        // Clean up any resources when navigating away
    }
});
```

See `page-examples.js` for more detailed examples.

## Configuration

You can customize the PJAX system by modifying the `PjaxConfig` object in `pjax-handler.js`:

```javascript
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
```

## Excluding Links

To exclude a link from PJAX navigation, add the `data-no-pjax` attribute:

```html
<a href="./external-page.html" data-no-pjax>External Link</a>
```

## Events

The PJAX system dispatches several events that you can listen for:

```javascript
// Listen for page load completion
window.addEventListener('pjax:complete', (event) => {
    const { url, path, title } = event.detail;
    console.log(`Loaded page: ${title}`);
});

// Listen for content before it's replaced
window.addEventListener('pjax:before-replace', (event) => {
    const { url, path, content } = event.detail;
    console.log(`About to replace content with ${path}`);
});

// Listen for after content is replaced
window.addEventListener('pjax:after-replace', (event) => {
    const { url, path } = event.detail;
    console.log(`Content replaced for ${path}`);
});
```

## Component Architecture

The PJAX system follows SOLID principles:

- **Single Responsibility**: Each class handles one specific concern
- **Open-Closed**: Extend with new page handlers without modifying existing code
- **Liskov Substitution**: Page handlers follow consistent interface
- **Interface Segregation**: Clear separation of page handler methods
- **Dependency Inversion**: Uses events and config for loose coupling 