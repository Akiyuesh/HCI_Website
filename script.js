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
let lastFocusedElement;

function openAboutModal() {
    if (!aboutModal) return;

    lastFocusedElement = document.activeElement;
    aboutModal.hidden = false;
    document.body.classList.add("modal-open");
    aboutModalContent.focus();
}

function closeAboutModal() {
    if (!aboutModal || aboutModal.hidden) return;

    aboutModal.hidden = true;
    document.body.classList.remove("modal-open");
    lastFocusedElement?.focus();
}

aboutLink?.addEventListener("click", (event) => {
    event.preventDefault();
    openAboutModal();
});

closeAboutButtons.forEach((button) => {
    button.addEventListener("click", closeAboutModal);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAboutModal();
});
