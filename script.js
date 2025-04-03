const ad = () =>
    console.log(
        "%c既然你看到這裡了，那趕快去報名 SITCON Camp！",
        "font-size: 40px; background-color: #f56f21; color: #000;font-family:system-ui;"
    );

ad();

// Debounce function to limit how often a function can be called
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function to limit how often a function can be called
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimized scroll handler
const handleScroll = debounce(() => {
    const scroll = window.scrollY;
    document.documentElement.style.setProperty("--scroll", scroll);
}, 16); // ~60fps

// Optimized viewport check
const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
};

// Optimized AOS handler
const handleAOS = throttle(() => {
    const aosElements = document.querySelectorAll(".aos");
    aosElements.forEach((element) => {
        if (isElementInViewport(element)) {
            element.classList.add("ed");
        } else {
            element.classList.remove("ed");
        }
    });
}, 100);

// Initialize scroll handlers
window.addEventListener("scroll", handleScroll, { passive: true });
window.addEventListener("scroll", handleAOS, { passive: true });
handleAOS(); // Initial check

// Optimized device size check
let isMobile = window.innerWidth <= 768;
const checkDeviceSize = debounce(() => {
    isMobile = window.innerWidth <= 768;
}, 250);

window.addEventListener("resize", checkDeviceSize, { passive: true });
window.addEventListener("orientationchange", checkDeviceSize, { passive: true });

// Optimized scroll to top button
const scrollToTopBtn = document.getElementById("scrollToTopBtn");
let scrollTimeout;

const hideButtonAfterDelay = debounce(() => {
    if (isMobile) {
        scrollToTopBtn.classList.remove("visible");
    }
}, 1500);

const toggleScrollToTopButton = throttle(() => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add("visible");
        hideButtonAfterDelay();
    } else {
        scrollToTopBtn.classList.remove("visible");
    }
}, 100);

// Touch event handling
let touchStartY = 0;
let touchEndY = 0;

window.addEventListener("touchstart", (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener("touchend", (e) => {
    touchEndY = e.changedTouches[0].clientY;
    if (Math.abs(touchStartY - touchEndY) > 5) {
        hideButtonAfterDelay();
    }
}, { passive: true });

scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

window.addEventListener("scroll", toggleScrollToTopButton, { passive: true });
toggleScrollToTopButton();

// Optimized year click handler
let yearClickCount = 0;
let yearClickTimeout;
const yearElement = document.getElementById('year');

const createDamageNumber = (x, y) => {
    const damageNumber = document.createElement('div');
    damageNumber.classList.add('damage-number');
    damageNumber.textContent = '1';
    damageNumber.style.left = `${x}px`;
    damageNumber.style.top = `${y}px`;
    document.body.appendChild(damageNumber);
    
    requestAnimationFrame(() => {
        damageNumber.style.opacity = '0';
        damageNumber.style.transform = 'translateY(-50px)';
    });
    
    setTimeout(() => {
        document.body.removeChild(damageNumber);
    }, 1000);
};

const show404Page = () => {
    document.body.classList.add('easter-egg');
    setTimeout(() => {
        document.body.classList.remove('easter-egg');
    }, 4000);
};

const handleYearClick = (x, y) => {
    createDamageNumber(x, y);
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
};

yearElement.addEventListener('click', (e) => {
    handleYearClick(e.clientX, e.clientY);
});

yearElement.addEventListener('touchend', (e) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    handleYearClick(touch.clientX, touch.clientY);
});

// DevTools detection
document.addEventListener("keydown", e => {
    if (
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        e.key === "F12"
    ) {
        ad();
    }
});
