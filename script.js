const links = document.querySelectorAll('.main-nav a');
const homeNavLink = document.querySelector('.main-nav a[href="#home"]');
const logoLink = document.querySelector('.site-header a[href="#home"]');

function setActiveLink(link) {
  links.forEach((l) => {
    l.classList.remove('active');
    l.removeAttribute('aria-current');
  });

  if (link) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }
}

links.forEach((link) => {
  link.addEventListener('click', () => {
    setActiveLink(link);
  });
});

if (logoLink) {
  logoLink.addEventListener('click', () => {
    setActiveLink(homeNavLink);
  });
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

const campusSlideshow = document.querySelector(".campus-slideshow__showcase");

if (campusSlideshow) {
    const campusSlides = [...campusSlideshow.querySelectorAll(".campus-slideshow__slide")];
    const campusIndicators = campusSlideshow.querySelector(".campus-slideshow__indicators");
    const campusPreviousButton = campusSlideshow.querySelector(".campus-slideshow__control.previous");
    const campusNextButton = campusSlideshow.querySelector(".campus-slideshow__control.next");
    const campusSlideInterval = 4000;
    let campusCurrentSlide = 0;
    let campusTimerId;

    if (campusSlides.length > 0 && campusIndicators && campusPreviousButton && campusNextButton) {
        const campusIndicatorButtons = campusSlides.map((_, index) => {
            const indicator = document.createElement("button");
            indicator.className = "campus-slideshow__indicator";
            indicator.type = "button";
            indicator.setAttribute("aria-label", `Go to featured place ${index + 1}`);
            indicator.addEventListener("click", () => showCampusSlide(index));
            campusIndicators.append(indicator);
            return indicator;
        });

        function showCampusSlide(index) {
            campusSlides.forEach((slide, slideIndex) => {
                slide.classList.toggle("is-active", slideIndex === index);
                campusIndicatorButtons[slideIndex].classList.toggle("is-active", slideIndex === index);
                if (slideIndex === index) {
                    campusIndicatorButtons[slideIndex].setAttribute("aria-current", "true");
                } else {
                    campusIndicatorButtons[slideIndex].removeAttribute("aria-current");
                }
            });
            campusCurrentSlide = index;
        }

        function startCampusSlideshow() {
            window.clearInterval(campusTimerId);
            campusTimerId = window.setInterval(() => {
                showCampusSlide((campusCurrentSlide + 1) % campusSlides.length);
            }, campusSlideInterval);
        }

        showCampusSlide(0);
        startCampusSlideshow();

        campusPreviousButton.addEventListener("click", () => {
            showCampusSlide((campusCurrentSlide - 1 + campusSlides.length) % campusSlides.length);
            startCampusSlideshow();
        });

        campusNextButton.addEventListener("click", () => {
            showCampusSlide((campusCurrentSlide + 1) % campusSlides.length);
            startCampusSlideshow();
        });

        campusSlideshow.addEventListener("mouseenter", () => {
            window.clearInterval(campusTimerId);
        });
        campusSlideshow.addEventListener("mouseleave", startCampusSlideshow);
        campusSlideshow.addEventListener("focusin", () => {
            window.clearInterval(campusTimerId);
        });
        campusSlideshow.addEventListener("focusout", (event) => {
            if (!campusSlideshow.contains(event.relatedTarget)) {
                startCampusSlideshow();
            }
        });
    }
}

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

const locationLink = document.querySelector(".location-link");
const locationDialog = document.querySelector(".location-dialog");
const locationDialogClose = document.querySelector(".location-dialog-close");

if (locationLink && locationDialog && locationDialogClose) {
    locationLink.addEventListener("click", () => locationDialog.showModal());
    locationDialogClose.addEventListener("click", () => locationDialog.close());

    locationDialog.addEventListener("click", (event) => {
        if (event.target === locationDialog) {
            locationDialog.close();
        }
    });
}

const exploreButton = document.querySelector(".explore-button");
const exploreDialog = document.querySelector("#explore-dialog");
const exploreDialogClose = exploreDialog?.querySelector(".explore-dialog__close");
const explorePlaceButtons = exploreDialog?.querySelectorAll(".explore-place-button");
const explorePlacePanels = exploreDialog?.querySelectorAll(".explore-place-panel");

exploreButton?.addEventListener("click", () => {
    if (!exploreDialog) return;

    exploreDialog.showModal();
    exploreButton.setAttribute("aria-expanded", "true");
});
exploreDialogClose?.addEventListener("click", () => exploreDialog?.close());
exploreDialog?.addEventListener("close", () => {
    exploreButton?.setAttribute("aria-expanded", "false");
});

exploreDialog?.addEventListener("click", (event) => {
    if (event.target === exploreDialog) {
        exploreDialog.close();
    }
});

if (explorePlaceButtons && explorePlacePanels) {
    explorePlaceButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedPanelId = button.getAttribute("aria-controls");

            explorePlaceButtons.forEach((placeButton) => {
                placeButton.setAttribute("aria-pressed", String(placeButton === button));
            });

            explorePlacePanels.forEach((panel) => {
                panel.hidden = panel.id !== selectedPanelId;
            });
        });
    });
}

exploreDialog?.querySelectorAll(".explore-carousel").forEach((carousel) => {
    const slides = [...carousel.querySelectorAll(".explore-slide-fade")];
    const indicators = carousel.querySelector(".explore-slide-indicators");
    const previousButton = carousel.querySelector(".explore-slide-control.previous");
    const nextButton = carousel.querySelector(".explore-slide-control.next");
    let currentSlide = -1;

    if (slides.length === 0 || !indicators || !previousButton || !nextButton) return;

    const indicatorButtons = slides.map((_, index) => {
        const indicator = document.createElement("button");
        indicator.className = "explore-slide-indicator";
        indicator.type = "button";
        indicator.setAttribute("aria-label", `Go to image ${index + 1}`);
        indicator.addEventListener("click", () => showSlide(index));
        indicators.append(indicator);
        return indicator;
    });

    function showSlide(index) {
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle("is-active", slideIndex === index);
            indicatorButtons[slideIndex].classList.toggle("is-active", slideIndex === index);
            if (slideIndex === index) {
                indicatorButtons[slideIndex].setAttribute("aria-current", "true");
            } else {
                indicatorButtons[slideIndex].removeAttribute("aria-current");
            }
        });
        currentSlide = index;
    }

    showSlide(0);
    const hasMultipleSlides = slides.length > 1;
    previousButton.hidden = !hasMultipleSlides;
    nextButton.hidden = !hasMultipleSlides;
    indicators.hidden = !hasMultipleSlides;

    previousButton.addEventListener("click", () => {
        showSlide((currentSlide - 1 + slides.length) % slides.length);
    });

    nextButton.addEventListener("click", () => {
        showSlide((currentSlide + 1) % slides.length);
    });
});
