const slideshow = document.querySelector(".slideshow");
const slides = document.querySelectorAll(".slide-fade");
const indicators = document.querySelector(".slide-indicators");
const caption = document.querySelector(".slide-caption");
const previousButton = document.querySelector(".slide-control.previous");
const nextButton = document.querySelector(".slide-control.next");
const slideInterval = 4000;
let currentSlide = 0;
let timerId;

function showSlide(index) {
    slides[currentSlide].classList.remove("is-active");
    indicators.children[currentSlide].classList.remove("is-active");
    indicators.children[currentSlide].removeAttribute("aria-current");
    currentSlide = index;
    slides[currentSlide].classList.add("is-active");
    indicators.children[currentSlide].classList.add("is-active");
    indicators.children[currentSlide].setAttribute("aria-current", "true");
    caption.textContent = slides[currentSlide].querySelector("img").alt;
}

function startSlideshow() {
    window.clearInterval(timerId);
    timerId = window.setInterval(() => {
        showSlide((currentSlide + 1) % slides.length);
    }, slideInterval);
}

if (slideshow && slides.length > 0 && indicators && caption && previousButton && nextButton) {
    slides.forEach((slide, index) => {
        const indicator = document.createElement("button");
        indicator.className = "slide-indicator";
        indicator.type = "button";
        indicator.setAttribute("aria-label", `Go to slide ${index + 1}`);
        indicator.addEventListener("click", () => showSlide(index));
        indicators.append(indicator);
    });

    slides[0].classList.add("is-active");
    indicators.children[0].classList.add("is-active");
    indicators.children[0].setAttribute("aria-current", "true");
    caption.textContent = slides[0].querySelector("img").alt;
    startSlideshow();

    previousButton.addEventListener("click", () => {
        showSlide((currentSlide - 1 + slides.length) % slides.length);
    });

    nextButton.addEventListener("click", () => {
        showSlide((currentSlide + 1) % slides.length);
    });

    slideshow.addEventListener("mouseenter", () => {
        window.clearInterval(timerId);
    });

    slideshow.addEventListener("mouseleave", startSlideshow);
}

const header = document.querySelector('.site-header');
const nav = document.querySelector('.main-nav');
const observer = new IntersectionObserver(
    ([entry]) => {
      // header fully out of view -> dock the nav
      nav.classList.toggle('is-docked', !entry.isIntersecting);
    },
    { threshold: 0 }
  );

  observer.observe(header);

const aboutLink = document.querySelector("#about-link");
const aboutModal = document.querySelector(".about-modal");
const aboutModalContent = document.querySelector(".about-modal__content");
const closeAboutButtons = document.querySelectorAll("[data-close-about]");
const aboutCloseButton = aboutModal?.querySelector(".about-modal__close");
let lastFocusedElement;
let closeModalTimer;

function getModalCloseDelay() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 0 : 260;
}

const focusableModalElements = () => aboutModal?.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
);

function openAboutModal() {
    if (!aboutModal) return;

    window.clearTimeout(closeModalTimer);
    lastFocusedElement = document.activeElement;
    aboutModal.classList.remove("is-closing");
    aboutModal.hidden = false;
    document.body.classList.add("modal-open");
    aboutLink?.setAttribute("aria-expanded", "true");
    window.requestAnimationFrame(() => aboutCloseButton?.focus());
}

function closeAboutModal() {
    if (!aboutModal || aboutModal.hidden || aboutModal.classList.contains("is-closing")) return;

    aboutModal.classList.add("is-closing");
    document.body.classList.remove("modal-open");
    aboutLink?.setAttribute("aria-expanded", "false");

    closeModalTimer = window.setTimeout(() => {
        aboutModal.hidden = true;
        aboutModal.classList.remove("is-closing");
        lastFocusedElement?.focus();
    }, getModalCloseDelay());
}

aboutLink?.addEventListener("click", (event) => {
    event.preventDefault();
    openAboutModal();
});

closeAboutButtons.forEach((button) => {
    button.addEventListener("click", closeAboutModal);
});

document.addEventListener("keydown", (event) => {
    if (!aboutModal || aboutModal.hidden) return;

    if (event.key === "Escape") {
        closeAboutModal();
        return;
    }

    if (event.key !== "Tab") return;

    const focusableElements = [...(focusableModalElements() ?? [])];
    if (focusableElements.length === 0) {
        event.preventDefault();
        aboutModalContent?.focus();
        return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
});
