document.addEventListener("scroll", () => {
  const topbar = document.querySelector(".topbar");
  if (!topbar) return;
  const scrolled = window.scrollY > 10;
  topbar.style.boxShadow = scrolled
    ? "0 12px 32px rgba(0, 0, 0, 0.3)"
    : "0 12px 38px rgba(0, 0, 0, 0.28)";
});

let lastScrollY = 0;
let lenis;
const cursorHalo = document.querySelector(".cursor-halo");

// Air-flow zoom transitions for each section with direction-aware anims
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const currentScroll = lenis ? lenis.scroll : window.scrollY;
      const direction = currentScroll >= lastScrollY ? "down" : "up";
      entry.target.classList.add("in-view");
      entry.target.classList.remove("from-down", "from-up");
      // force reflow to restart animation
      void entry.target.offsetWidth;
      entry.target.classList.add(direction === "down" ? "from-down" : "from-up");
    });
    lastScrollY = lenis ? lenis.scroll : window.scrollY;
  },
  { threshold: 0.25 }
);

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(
    ".slide, .process, .comparison, .cta-band, .footer"
  );
  sections.forEach((section) => {
    section.classList.add("air-zoom");
    observer.observe(section);
  });

  // Lenis smooth scroll
  if (window.Lenis) {
    lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      smoothTouch: false,
      gestureOrientation: "vertical",
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on("scroll", ({ scroll }) => {
      lastScrollY = scroll;
    });
  } else {
    lastScrollY = window.scrollY;
    window.addEventListener("scroll", () => {
      lastScrollY = window.scrollY;
    });
  }

  // Theme toggle
  const toggle = document.querySelector(".theme-toggle");
  const root = document.body;
  const current = localStorage.getItem("theme") || "dark";
  root.dataset.theme = current;
  toggle.textContent = current === "light" ? "☾" : "☀︎";
  toggle.setAttribute("aria-label", current === "light" ? "Switch to dark mode" : "Switch to light mode");

  toggle.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
    toggle.textContent = next === "light" ? "☾" : "☀︎";
    toggle.setAttribute("aria-label", next === "light" ? "Switch to dark mode" : "Switch to light mode");
  });

  // Cursor halo tracking
  if (cursorHalo) {
    document.addEventListener("mousemove", (e) => {
      cursorHalo.style.left = `${e.clientX}px`;
      cursorHalo.style.top = `${e.clientY}px`;
    });
  }
});

