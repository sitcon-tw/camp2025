// Function to log a message to the console, encouraging users to apply for SITCON Camp.
const ad = () =>
    console.log(
        "%cIf you're seeing this, go apply for SITCON Camp!", // Translated message
        "font-size: 40px; background-color: #f56f21; color: #000;font-family:system-ui;"
    );

ad(); // Call the function immediately on script load.

// Debounce function: Limits the rate at which a function can fire.
// Ensures that the function is only called after the user hasn't performed the action for a specific duration.
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout); // Clear the previous timeout
            func(...args); // Execute the function
        };
        clearTimeout(timeout); // Reset the timeout on every call
        timeout = setTimeout(later, wait); // Set a new timeout
    };
}

// Throttle function: Ensures that a function is called at most once within a specified time limit.
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) { // Only execute if not currently throttled
            func(...args); // Execute the function
            inThrottle = true; // Set the throttle flag
            setTimeout(() => inThrottle = false, limit); // Release the throttle after the limit
        }
    };
}

// Optimized scroll handler using debounce.
// Updates a CSS variable '--scroll' with the current scroll position.
// Debounced with a 16ms wait time, roughly equivalent to 60 frames per second.
const handleScroll = debounce(() => {
    const scroll = window.scrollY;
    document.documentElement.style.setProperty("--scroll", scroll);
}, 16); // ~60fps

// Helper function to check if an element is currently within the viewport.
const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
};

// Optimized handler for Animate On Scroll (AOS) elements using throttle.
// Adds the 'ed' class to elements with the 'aos' class when they enter the viewport,
// and removes it when they leave.
// Throttled to run at most every 100ms.
const handleAOS = throttle(() => {
    const aosElements = document.querySelectorAll(".aos");
    aosElements.forEach((element) => {
        if (isElementInViewport(element)) {
            element.classList.add("ed"); // Add class when in view
        } else {
            element.classList.remove("ed"); // Remove class when out of view
        }
    });
}, 100);

// Initialize scroll event listeners with passive option for better performance.
window.addEventListener("scroll", handleScroll, { passive: true });
window.addEventListener("scroll", handleAOS, { passive: true });
handleAOS(); // Run once on load to check initial element visibility.

// Optimized device size check using debounce.
// Updates the 'isMobile' flag based on window width.
let isMobile = window.innerWidth <= 768;
const checkDeviceSize = debounce(() => {
    isMobile = window.innerWidth <= 768;
}, 250); // Debounced to run 250ms after the last resize/orientation change.

// Add event listeners for window resize and orientation changes.
window.addEventListener("resize", checkDeviceSize, { passive: true });
window.addEventListener("orientationchange", checkDeviceSize, { passive: true });

// Optimized scroll-to-top button functionality.
const scrollToTopBtn = document.getElementById("scrollToTopBtn");
let scrollTimeout; // Timeout variable for hiding the button

// Debounced function to hide the scroll-to-top button after a delay on mobile devices.
hideButtonAfterDelay = debounce(() => {
    if (isMobile) {
        scrollToTopBtn.classList.remove("visible");
    }
}, 1500); // Hide after 1.5 seconds of inactivity.

// Throttled function to toggle the visibility of the scroll-to-top button based on scroll position.
const toggleScrollToTopButton = throttle(() => {
    if (window.scrollY > 300) { // Show button if scrolled down more than 300px
        scrollToTopBtn.classList.add("visible");
        hideButtonAfterDelay(); // Start the timer to hide the button (on mobile)
    } else {
        scrollToTopBtn.classList.remove("visible"); // Hide button if near the top
    }
}, 100); // Throttled to check every 100ms.

// Touch event handling to reset the hide button timer on touch scroll.
let touchStartY = 0;
let touchEndY = 0;

window.addEventListener("touchstart", (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener("touchend", (e) => {
    touchEndY = e.changedTouches[0].clientY;
    // If the scroll distance is significant, reset the hide timer.
    if (Math.abs(touchStartY - touchEndY) > 5) { 
        hideButtonAfterDelay();
    }
}, { passive: true });

// Add click listener to the scroll-to-top button to scroll smoothly to the top.
scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Enable smooth scrolling
    });
});

// Add scroll listener to manage button visibility.
window.addEventListener("scroll", toggleScrollToTopButton, { passive: true });
toggleScrollToTopButton(); // Initial check for button visibility on load.

// Easter egg functionality: Year element click handler.
let yearClickCount = 0; // Counter for clicks on the year element
let yearClickTimeout; // Timeout to reset the click count
const yearElement = document.getElementById('year');

// Creates a floating "damage number" (like in games) at the click position.
const createDamageNumber = (x, y) => {
    const damageNumber = document.createElement('div');
    damageNumber.classList.add('damage-number');
    damageNumber.textContent = '1'; // Damage value
    damageNumber.style.left = `${x}px`; // Position horizontally
    damageNumber.style.top = `${y}px`; // Position vertically
    document.body.appendChild(damageNumber);
    
    // Animate the number floating up and fading out.
    requestAnimationFrame(() => { // Use rAF for smoother animation
        damageNumber.style.opacity = '0';
        damageNumber.style.transform = 'translateY(-50px)';
    });
    
    // Remove the element after the animation finishes.
    setTimeout(() => {
        if (document.body.contains(damageNumber)) {
             document.body.removeChild(damageNumber);
        }
    }, 1000); // Corresponds to the animation duration
};

// Function to trigger the easter egg (briefly adding a class to the body).
const show404Page = () => {
    document.body.classList.add('easter-egg');
    // Remove the class after 4 seconds.
    setTimeout(() => {
        document.body.classList.remove('easter-egg');
    }, 4000);
};

// Handles clicks or touches on the year element.
// Creates a damage number and increments the click counter.
// If clicked 4 times within 3 seconds, triggers the easter egg.
const handleYearClick = (x, y) => {
    createDamageNumber(x, y); // Show damage number
    clearTimeout(yearClickTimeout); // Reset the timeout on each click
    yearClickCount++; // Increment click count
    
    if (yearClickCount === 4) { // Check if 4 clicks reached
        show404Page(); // Trigger easter egg
        yearClickCount = 0; // Reset count
    } else {
        // Set a timeout to reset the click count if no more clicks occur soon.
        yearClickTimeout = setTimeout(() => {
            yearClickCount = 0;
        }, 3000); // 3-second window for clicks
    }
};

// Add event listener for clicks on the year element.
yearElement.addEventListener('click', (e) => {
    handleYearClick(e.clientX, e.clientY); // Pass click coordinates
});

// Add event listener for touch ends on the year element.
yearElement.addEventListener('touchend', (e) => {
    e.preventDefault(); // Prevent potential duplicate click events
    const touch = e.changedTouches[0];
    handleYearClick(touch.clientX, touch.clientY); // Pass touch coordinates
});

// Simple DevTools detection based on common keyboard shortcuts.
// Calls the 'ad()' function if DevTools shortcuts are detected.
document.addEventListener("keydown", e => {
    if (
        (e.ctrlKey && e.shiftKey && e.key === "I") || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.key === "J") || // Ctrl+Shift+J
        e.key === "F12" // F12
    ) {
        ad(); // Show the console message
    }
});
