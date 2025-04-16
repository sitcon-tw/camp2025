const ad = () =>
    console.log(
        "%c既然你看到這裡了，那趕快去報名 SITCON Camp！",
        "font-size: 40px; background-color: #f56f21; color: #000;font-family:system-ui;"
    );

ad();

// Scroll
window.addEventListener("scroll", function () {
    let scroll = window.scrollY;
    document.documentElement.style.setProperty("--scroll", scroll);
});

// Animate on Scroll
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.bottom < 0 || rect.top > window.innerHeight;
}

function addClassToVisibleElements() {
    var aosElements = document.querySelectorAll(".aos");
    aosElements.forEach(function (aosElement) {
        if (!isElementInViewport(aosElement)) aosElement.classList.add("ed");
        else aosElement.classList.remove("ed");
    });
}

// Initialize animations
function initializeAnimations() {
    // Remove any existing scroll listeners to prevent duplicates
    document.removeEventListener("scroll", addClassToVisibleElements);
    
    // Force immediate animation for all elements in viewport when page loads
    addClassToVisibleElements();
    
    // Special handling for header images and elements
    const headerImages = document.querySelectorAll('header .img');
    if (headerImages.length > 0) {
        // If we're on a page with header images (like homepage)
        // Force them to appear with animation after a tiny delay
        setTimeout(() => {
            headerImages.forEach(img => {
                img.classList.add('ed');
            });
            
            // Also animate other header elements like title and buttons
            const headerElements = document.querySelectorAll('header .fadeIn');
            headerElements.forEach(el => {
                el.classList.add('ed');
            });
        }, 0); // Use 0ms timeout for faster execution
    }
    
    // Add listeners for scroll events
    document.addEventListener("scroll", addClassToVisibleElements);
}

// Call immediately on page load
initializeAnimations();

// Force animations specifically for index page elements
function forceIndexPageAnimations() {
    // Check if we're on the index page (has year element or typical homepage elements)
    const yearElement = document.getElementById('year');
    const header = document.querySelector('header');
    const mainContent = document.querySelector('#content');
    
    if (yearElement || (header && header.querySelector('.img'))) {
        console.log('Index page detected, forcing animations');
        
        // Force ALL header elements to appear immediately with inline styles for maximum force
        if (header) {
            // Apply to all header images with both class and inline style
            const headerImages = header.querySelectorAll('.img');
            headerImages.forEach(img => {
                img.classList.add('ed');
                // Use inline opacity as a backup
                img.style.opacity = '1';
            });
            
            // Apply to header title
            const headerTitle = header.querySelector('h1');
            if (headerTitle) {
                headerTitle.classList.add('ed');
                headerTitle.style.opacity = '1';
            }
            
            // Apply to soon section
            const soon = header.querySelector('#soon');
            if (soon) {
                soon.classList.add('ed');
                soon.style.opacity = '1';
            }
            
            // Apply to ALL animated elements in header
            const allAosElements = header.querySelectorAll('.aos, .fadeIn');
            allAosElements.forEach(el => {
                el.classList.add('ed');
                el.style.opacity = '1';
            });
        }
    }
}

// Create a MutationObserver to detect when the content is replaced by PJAX
function setupIndexPageObserver() {
    // Check if we're on a page that could navigate to the index
    if (!document.querySelector('#content')) return;
    
    // Create a MutationObserver to watch for content changes
    const contentObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // After content changes, check if we're on the index page
                const isIndexPage = window.location.pathname.endsWith('/') || 
                                   window.location.pathname.endsWith('index.html') ||
                                   window.location.pathname.endsWith('index_en.html');
                
                if (isIndexPage) {
                    console.log('Content changed, detected index page via observer');
                    // Force animations with multiple attempts
                    forceIndexPageAnimations();
                    
                    // Also try with delays
                    setTimeout(forceIndexPageAnimations, 50);
                    setTimeout(forceIndexPageAnimations, 200);
                }
            }
        });
    });
    
    // Start observing the content container
    contentObserver.observe(document.querySelector('#content'), { 
        childList: true,
        subtree: true 
    });
}

// Initialize the observer on page load
document.addEventListener('DOMContentLoaded', setupIndexPageObserver);

// Create a single PJAX handler that combines all functionality
function handlePjaxComplete(event) {
    console.log('PJAX navigation complete');
    
    // Check if navigating to index page
    const isIndexPage = window.location.pathname.endsWith('/') || 
                      window.location.pathname.endsWith('index.html') ||
                      window.location.pathname.endsWith('index_en.html');
    
    if (isIndexPage) {
        console.log('Navigating to index page, forcing immediate animations');
        // Force animations immediately
        forceIndexPageAnimations();
        
        // Also use a staggered approach with multiple attempts
        for (let delay of [10, 50, 100, 200, 500]) {
            setTimeout(() => {
                forceIndexPageAnimations();
            }, delay);
        }
    }
    
    // Re-run animations for all pages
    initializeAnimations();
    
    // Re-initialize all interactive features
    initializeAllFeatures();
}

// Remove any existing PJAX listeners to prevent duplicates
document.removeEventListener('pjax:complete', handlePjaxComplete);

// Add our consolidated PJAX handler
document.addEventListener('pjax:complete', handlePjaxComplete);

document.addEventListener("keydown", e => {
    // Check for common DevTools shortcuts
    if (
        // Ctrl+Shift+I (Windows/Linux) or Cmd+Option+I (Mac)
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        // Ctrl+Shift+J (Windows/Linux) or Cmd+Option+J (Mac)
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        // F12
        e.key === "F12"
    )
        ad();
});

// Scroll to top button
let scrollToTopBtn;
let scrollTimeout;
let isMobile = window.innerWidth <= 768;

function initializeScrollToTop() {
    scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (!scrollToTopBtn) return;
    
    // Remove any existing listeners to prevent duplicates
    scrollToTopBtn.removeEventListener("click", scrollToTopHandler);
    window.removeEventListener("scroll", toggleScrollToTopButton);
    
    // Add click listener
    scrollToTopBtn.addEventListener("click", scrollToTopHandler);
    
    // Add scroll listener
    window.addEventListener("scroll", toggleScrollToTopButton);
    
    // Check initial state
    toggleScrollToTopButton();
}

function scrollToTopHandler() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Use more reliable method to detect device type and monitor window size changes
function checkDeviceSize() {
    isMobile = window.innerWidth <= 768;
}

window.addEventListener("resize", checkDeviceSize);
window.addEventListener("orientationchange", checkDeviceSize);

function hideButtonAfterDelay() {
    if (!scrollToTopBtn) return;
    
    if (isMobile) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            scrollToTopBtn.classList.remove("visible");
        }, 1500); // Hide after 1.5 seconds
    }
}

function toggleScrollToTopButton() {
    if (!scrollToTopBtn) return;
    
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add("visible");
        
        // For mobile devices, hide button after scrolling stops
        hideButtonAfterDelay();
    } else {
        scrollToTopBtn.classList.remove("visible");
    }
}

// Add touch event handling
function initializeTouchHandling() {
    // Remove existing touch listeners to prevent duplicates
    window.removeEventListener("touchstart", touchStartHandler);
    window.removeEventListener("touchend", touchEndHandler);
    
    // Add touch listeners
    window.addEventListener("touchstart", touchStartHandler, { passive: true });
    window.addEventListener("touchend", touchEndHandler, { passive: true });
}

// Touch handler variables
let touchStartY = 0;

function touchStartHandler(e) {
    touchStartY = e.touches[0].clientY;
}

function touchEndHandler(e) {
    const touchEndY = e.changedTouches[0].clientY;
    // Trigger hide logic after touch ends
    if (Math.abs(touchStartY - touchEndY) > 5) { // Significant scroll detected
        hideButtonAfterDelay();
    }
}

// Easter egg: Click year 4 times to show 404 page
let yearClickCount = 0;
let yearClickTimeout;

// Add damage number effect when clicking year
function createDamageNumber(x, y) {
    const damageNumber = document.createElement('div');
    damageNumber.classList.add('damage-number');
    damageNumber.textContent = '1'; // This is the damage number, you can change it to any text you want like "SITCON"
    damageNumber.style.left = `${x}px`;
    damageNumber.style.top = `${y}px`;
    document.body.appendChild(damageNumber);
    
    // Remove element after animation completes
    setTimeout(() => {
        document.body.removeChild(damageNumber);
    }, 1000);
}

function show404Page() {
    document.body.classList.add('easter-egg');
    setTimeout(() => {
        document.body.classList.remove('easter-egg');
    }, 4000);
}

function initializeYearEasterEgg() {
    const yearElement = document.getElementById('year');
    if (!yearElement) return;
    
    // Reset click counter
    yearClickCount = 0;
    clearTimeout(yearClickTimeout);
    
    // Remove any existing listeners to prevent duplicates
    yearElement.removeEventListener('click', yearClickHandler);
    yearElement.removeEventListener('touchend', yearTouchHandler);
    
    // Add click listener
    yearElement.addEventListener('click', yearClickHandler);
    
    // Add touch support for mobile
    yearElement.addEventListener('touchend', yearTouchHandler);
}

function yearClickHandler(e) {
    // Create the damage number at click position
    createDamageNumber(e.clientX, e.clientY);
    
    clearTimeout(yearClickTimeout);
    yearClickCount++;
    
    if (yearClickCount >= 4) {
        show404Page();
        yearClickCount = 0;
    } else {
        yearClickTimeout = setTimeout(() => {
            yearClickCount = 0;
        }, 3000); // Reset counter if not clicked 4 times within 3 seconds
    }
}

function yearTouchHandler(e) {
    e.preventDefault(); // Prevent double triggering on mobile
    
    // Get touch position for damage number
    const touch = e.changedTouches[0];
    createDamageNumber(touch.clientX, touch.clientY);
    
    clearTimeout(yearClickTimeout);
    yearClickCount++;
    
    if (yearClickCount >= 4) {
        show404Page();
        yearClickCount = 0;
    } else {
        yearClickTimeout = setTimeout(() => {
            yearClickCount = 0;
        }, 3000);
    }
}

// Initialize all features
function initializeAllFeatures() {
    checkDeviceSize();
    initializeScrollToTop();
    initializeTouchHandling();
    initializeYearEasterEgg();
}

// Run initialization on DOM load
document.addEventListener('DOMContentLoaded', initializeAllFeatures);

// Run immediately in case DOMContentLoaded already fired
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initializeAllFeatures();
}
