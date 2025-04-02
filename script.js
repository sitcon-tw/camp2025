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

document.addEventListener("scroll", addClassToVisibleElements);
addClassToVisibleElements();

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
const scrollToTopBtn = document.getElementById("scrollToTopBtn");
let scrollTimeout;
let isMobile = window.innerWidth <= 768;

// Use more reliable method to detect device type and monitor window size changes
function checkDeviceSize() {
    isMobile = window.innerWidth <= 768;
}

window.addEventListener("resize", checkDeviceSize);
window.addEventListener("orientationchange", checkDeviceSize);

function hideButtonAfterDelay() {
    if (isMobile) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            scrollToTopBtn.classList.remove("visible");
        }, 1500); // Hide after 1.5 seconds
    }
}

function toggleScrollToTopButton() {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add("visible");
        
        // For mobile devices, hide button after scrolling stops
        hideButtonAfterDelay();
    } else {
        scrollToTopBtn.classList.remove("visible");
    }
}

// Add touch event handling
let touchStartY = 0;
let touchEndY = 0;

window.addEventListener("touchstart", (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener("touchend", (e) => {
    touchEndY = e.changedTouches[0].clientY;
    // Trigger hide logic after touch ends
    if (Math.abs(touchStartY - touchEndY) > 5) { // Significant scroll detected
        hideButtonAfterDelay();
    }
}, { passive: true });

scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

window.addEventListener("scroll", toggleScrollToTopButton);
toggleScrollToTopButton(); // Check initial state

// Easter egg: Click year 4 times to show 404 page
let yearClickCount = 0;
let yearClickTimeout;
const yearElement = document.getElementById('year');

function show404Page() {
    document.body.classList.add('easter-egg');
    setTimeout(() => {
        document.body.classList.remove('easter-egg');
    }, 4000);
}

yearElement.addEventListener('click', () => {
    clearTimeout(yearClickTimeout);
    yearClickCount++;
    
    if (yearClickCount === 4) {
        show404Page();
        yearClickCount = 0;
    } else {
        yearClickTimeout = setTimeout(() => {
            yearClickCount = 0;
        }, 3000); // Reset counter if not clicked 4 times within 3 seconds
    }
});

// Add touch support for mobile
yearElement.addEventListener('touchend', (e) => {
    e.preventDefault(); // Prevent double triggering on mobile
    clearTimeout(yearClickTimeout);
    yearClickCount++;
    
    if (yearClickCount === 4) {
        show404Page();
        yearClickCount = 0;
    } else {
        yearClickTimeout = setTimeout(() => {
            yearClickCount = 0;
        }, 3000);
    }
});
