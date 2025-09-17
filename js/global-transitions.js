(function () {
  "use strict";

  let isTransitioning = false;
  const transitionDuration = 800;

  // ===== Skip preloader if returning to index =====
  if (sessionStorage.getItem("returning-to-index") === "true") {
    console.log("Skipping universal stripe preloader for returning-to-index");
    // DON'T remove the flag here - let index script handle it
    // sessionStorage.removeItem("returning-to-index"); // REMOVED
    document.documentElement.classList.remove("page-loading");
    document.documentElement.style.opacity = "1";
    return; // stop universal preloader
  }

  // ===== Inject CSS =====
  function injectPreloaderStyles() {
    if (document.getElementById("preloader-styles")) return;

    const css = `
      #initial-preloader-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9997;
        background: linear-gradient(0deg, rgba(108,158,186,1) 0%, rgba(46,90,132,1) 100%);
      }
      #gradient-transition-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        pointer-events: none;
        overflow: hidden;
      }
      .stripe {
        position: absolute;
        width: 100vw;
        height: 33.33vh;
        transition: transform ${transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      .stripe-1 {
        top: 0;
        background: linear-gradient(135deg, #ffd93d 0%, #eab308 100%);
        transform: translateX(-100%);
      }
      .stripe-2 {
        top: 33.33vh;
        background: linear-gradient(135deg, #7ed321 0%, #22c55e 100%);
        transform: translateX(100%);
      }
      .stripe-3 {
        top: 66.66vh;
        background: linear-gradient(135deg, #4fc3f7 0%, #2563eb 100%);
        transform: translateX(-100%);
      }
      .stripe.animate-in { transform: translateX(0); }
      .stripe.animate-out { transform: translateX(100%); }
      .stripe-2.animate-out { transform: translateX(-100%); }
      .stripe::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.1) 100%);
        opacity: 0.3;
      }
    `;
    const style = document.createElement("style");
    style.id = "preloader-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ===== Create instant gradient background =====
  function createInstantBackground() {
    if (document.getElementById("initial-preloader-bg")) return;
    const bg = document.createElement("div");
    bg.id = "initial-preloader-bg";
    document.body.prepend(bg);
  }

  // ===== Stripe animations =====
  function animateStripesIn(overlay) {
    const stripes = overlay.querySelectorAll(".stripe");
    setTimeout(() => stripes[0].classList.add("animate-in"), 0);
    setTimeout(() => stripes[1].classList.add("animate-in"), 100);
    setTimeout(() => stripes[2].classList.add("animate-in"), 200);
  }

  function animateStripesOut(overlay, callback) {
    const stripes = overlay.querySelectorAll(".stripe");
    setTimeout(
      () => stripes[0].classList.replace("animate-in", "animate-out"),
      0
    );
    setTimeout(
      () => stripes[1].classList.replace("animate-in", "animate-out"),
      100
    );
    setTimeout(
      () => stripes[2].classList.replace("animate-in", "animate-out"),
      200
    );
    setTimeout(() => {
      overlay.remove();
      if (callback) callback();
    }, transitionDuration);
  }

  // ===== Show preloader on fresh load =====
  function showStripePreloader() {
    const path = window.location.pathname;
    const isIndex =
      path === "/" ||
      path === "/index.html" ||
      path.endsWith("/index.html") ||
      path === "" ||
      path.endsWith("/");

    // UPDATED: Also skip if returning to index (let index handle its own preloader)
    if (isIndex || 
        sessionStorage.getItem("navigating") === "true" ||
        sessionStorage.getItem("returning-to-index") === "true") {
      const bgElement = document.getElementById("initial-preloader-bg");
      if (bgElement) bgElement.remove();
      return;
    }

    createInstantBackground();
    const overlay = document.createElement("div");
    overlay.id = "gradient-transition-overlay";
    overlay.innerHTML = `
      <div class="stripe stripe-1"></div>
      <div class="stripe stripe-2"></div>
      <div class="stripe stripe-3"></div>
    `;
    document.body.appendChild(overlay);

    requestAnimationFrame(() => animateStripesIn(overlay));

    const hidePreloader = () => {
      setTimeout(() => {
        animateStripesOut(overlay, () => {
          const bg = document.getElementById("initial-preloader-bg");
          if (bg) bg.remove();
        });
      }, 200);
    };

    const minDisplayTime = 1000;
    const startTime = Date.now();
    const checkAndHide = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDisplayTime - elapsed);
      setTimeout(hidePreloader, remaining);
    };

    if (document.readyState === "complete") {
      checkAndHide();
    } else {
      window.addEventListener("load", checkAndHide);
    }
  }

  // ===== Handle navigation clicks =====
  function handleLinkClick(event) {
    const link = event.target.closest("a");
    const returnBtn = event.target.closest(".return-btn");
    const element = link || returnBtn;
    if (!element) return;

    let href;
    if (returnBtn) {
      // UPDATED: Use consistent path format
      href = "./index.html"; // or "./index.html" depending on your setup
      sessionStorage.setItem("returning-to-index", "true");
      console.log("Return button clicked - set returning-to-index flag");
    } else {
      href = link.getAttribute("href");
    }

    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    )
      return;
    if (
      link &&
      link.hostname !== window.location.hostname &&
      link.hostname !== ""
    )
      return;
    if (
      element.target === "_blank" ||
      element.hasAttribute("download") ||
      event.metaKey ||
      event.ctrlKey
    )
      return;

    event.preventDefault();
    if (isTransitioning) return;
    isTransitioning = true;

    // UPDATED: Don't set navigating flag when returning to index
    if (!returnBtn) {
      sessionStorage.setItem("navigating", "true");
    }

    createInstantBackground();
    const overlay = document.createElement("div");
    overlay.id = "gradient-transition-overlay";
    overlay.innerHTML = `
      <div class="stripe stripe-1"></div>
      <div class="stripe stripe-2"></div>
      <div class="stripe stripe-3"></div>
    `;
    document.body.appendChild(overlay);

    animateStripesIn(overlay);

    setTimeout(() => {
      window.location.href = href;
    }, 400);
  }

  // ===== Handle page entrance =====
  function handlePageEntrance() {
    const fromTransition = sessionStorage.getItem("navigating") === "true";
    if (fromTransition) {
      createInstantBackground();
      const overlay = document.createElement("div");
      overlay.id = "gradient-transition-overlay";
      overlay.innerHTML = `
        <div class="stripe stripe-1"></div>
        <div class="stripe stripe-2"></div>
        <div class="stripe stripe-3"></div>
      `;
      document.body.appendChild(overlay);

      overlay
        .querySelectorAll(".stripe")
        .forEach((s) => s.classList.add("animate-in"));

      setTimeout(() => {
        animateStripesOut(overlay, () => {
          const bg = document.getElementById("initial-preloader-bg");
          if (bg) bg.remove();
        });
      }, 100);
    } else {
      const bg = document.getElementById("initial-preloader-bg");
      if (bg) bg.remove();
    }
    sessionStorage.removeItem("navigating");
  }

  // ===== Init =====
  function init() {
    injectPreloaderStyles();
    document.addEventListener("click", handleLinkClick);
    if (sessionStorage.getItem("navigating") === "true") {
      handlePageEntrance();
    } else {
      showStripePreloader();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();