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

function toggleScrollToTopButton() {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add("visible");
    } else {
        scrollToTopBtn.classList.remove("visible");
    }
}

scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

window.addEventListener("scroll", toggleScrollToTopButton);
toggleScrollToTopButton(); // Check initial state
