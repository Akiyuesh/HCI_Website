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
