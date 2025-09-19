(function () {
  "use strict";

  let isTransitioning = false;
  const transitionDuration = 800;

  // ===== Enhanced flash prevention =====
  function preventFlashOnReturn() {
    // Set multiple layers of flash prevention
    const html = document.documentElement;
    const body = document.body;

    // Method 1: Set background immediately on html/body
    html.style.background =
      "linear-gradient(0deg, rgba(108,158,186,1) 0%, rgba(46,90,132,1) 100%)";
    body.style.background =
      "linear-gradient(0deg, rgba(108,158,186,1) 0%, rgba(46,90,132,1) 100%)";

    // Method 2: Hide content immediately
    body.style.visibility = "hidden";
    body.style.opacity = "0";

    // Method 3: Add transitioning class with !important styles
    html.classList.add("transitioning");
  }

  // ===== Create instant gradient background =====
  function createInstantBackground() {
    if (document.getElementById("initial-preloader-bg")) return;
    const bg = document.createElement("div");
    bg.id = "initial-preloader-bg";
    bg.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 9999 !important;
      background: linear-gradient(0deg, rgba(108,158,186,1) 0%, rgba(46,90,132,1) 100%) !important;
      pointer-events: none !important;
    `;
    document.body.prepend(bg);
  }

  // ===== Add theme color to prevent flash =====
  function addThemeColor() {
    if (document.querySelector('meta[name="theme-color"]')) return;
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = "#2e5a84";
    document.head.appendChild(meta);
  }

  // ===== Handle returning to index with transition =====
  const isReturningToIndex =
    sessionStorage.getItem("returning-to-index") === "true";
  console.log("🔍 Script start - returning to index:", isReturningToIndex);

  if (isReturningToIndex) {
    console.log("🎯 Setting up return transition");

    // Create multiple layers of flash prevention
    preventFlashOnReturn();
    createInstantBackground();

    // Set flag to show entrance transition instead of regular preloader
    sessionStorage.setItem("show-return-transition", "true");
    sessionStorage.removeItem("returning-to-index");

    console.log(
      "✅ Return transition setup complete, continuing to main logic"
    );
  }

  // ===== Enhanced CSS with better flash prevention =====
  function injectPreloaderStyles() {
    if (document.getElementById("preloader-styles")) return;

    const css = `
      /* Enhanced flash prevention */
      html.transitioning, 
      html.transitioning body {
        background: linear-gradient(0deg, rgba(108,158,186,1) 0%, rgba(46,90,132,1) 100%) !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
      }
      
      /* Immediate background for any page load */
      html.preload-bg,
      html.preload-bg body {
        background: linear-gradient(0deg, rgba(108,158,186,1) 0%, rgba(46,90,132,1) 100%) !important;
      }
      
      #initial-preloader-bg {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        z-index: 9999 !important;
        background: linear-gradient(0deg, rgba(108,158,186,1) 0%, rgba(46,90,132,1) 100%) !important;
        pointer-events: none !important;
      }
      
      /* Enhanced stripes */
      #gradient-transition-overlay {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        z-index: 10000 !important;
        pointer-events: none !important;
        overflow: hidden !important;
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
      
      /* Prevent any white flash during navigation */
      body.navigating {
        visibility: hidden !important;
        opacity: 0 !important;
      }
    `;

    const style = document.createElement("style");
    style.id = "preloader-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ===== Enhanced stripe animations =====
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

  // ===== Handle browser back/forward navigation =====
  function handleBrowserNavigation() {
    console.log("Browser navigation detected");

    const overlay = document.getElementById("gradient-transition-overlay");
    const bg = document.getElementById("initial-preloader-bg");

    if (overlay) overlay.remove();
    if (bg) bg.remove();

    isTransitioning = false;
    sessionStorage.removeItem("navigating");

    // Remove navigation classes
    document.documentElement.classList.remove("transitioning", "preload-bg");
    document.body.classList.remove("navigating");

    // Restore visibility
    document.body.style.visibility = "";
    document.body.style.opacity = "";
  }

  // ===== Show preloader on fresh load OR handle return transition =====
  function showStripePreloader() {
    const path = window.location.pathname;
    const isIndex =
      path === "/" ||
      path === "/index.html" ||
      path.endsWith("/index.html") ||
      path === "" ||
      path.endsWith("/");
    const isShowingReturnTransition =
      sessionStorage.getItem("show-return-transition") === "true";

    console.log("showStripePreloader called:", {
      path,
      isIndex,
      isShowingReturnTransition,
      navigating: sessionStorage.getItem("navigating"),
      allSessionStorage: { ...sessionStorage },
    });

    // Handle return to index transition
    if (isIndex && isShowingReturnTransition) {
      console.log("🎬 SHOWING RETURN TRANSITION TO INDEX");
      sessionStorage.removeItem("show-return-transition");

      // Ensure background is still there
      createInstantBackground();

      // Create the stripe transition overlay
      const overlay = document.createElement("div");
      overlay.id = "gradient-transition-overlay";
      overlay.innerHTML = `
        <div class="stripe stripe-1"></div>
        <div class="stripe stripe-2"></div>
        <div class="stripe stripe-3"></div>
      `;
      document.body.appendChild(overlay);

      // Start with stripes covering screen (simulating they came from previous page)
      requestAnimationFrame(() => {
        overlay
          .querySelectorAll(".stripe")
          .forEach((s) => s.classList.add("animate-in"));
        console.log("Stripes added animate-in class");

        // Animate them out to reveal the index page after a brief moment
        setTimeout(() => {
          console.log("Starting stripe exit animation");
          animateStripesOut(overlay, () => {
            console.log("Stripes animation complete, cleaning up");
            const bg = document.getElementById("initial-preloader-bg");
            if (bg) bg.remove();

            // Restore page visibility
            document.body.style.visibility = "";
            document.body.style.opacity = "";
            document.documentElement.classList.remove(
              "transitioning",
              "preload-bg"
            );
            document.body.classList.remove("navigating");

            // Clean up inline styles
            document.documentElement.style.background = "";
            document.body.style.background = "";
          });
        }, 300); // Increased delay to see the transition better
      });

      return; // Don't run regular preloader logic
    }

    // Skip regular preloader for index or during navigation
    if (isIndex || sessionStorage.getItem("navigating") === "true") {
      console.log("Skipping preloader for index page or navigation");
      const bgElement = document.getElementById("initial-preloader-bg");
      if (bgElement) {
        bgElement.remove();
        console.log("Removed background element");
      }

      // Clean up any transition states on index
      if (isIndex) {
        document.body.style.visibility = "";
        document.body.style.opacity = "";
        document.documentElement.classList.remove(
          "transitioning",
          "preload-bg"
        );
        document.body.classList.remove("navigating");
        document.documentElement.style.background = "";
        document.body.style.background = "";
      }

      return;
    }

    // Regular preloader for non-index pages
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

  // ===== Enhanced navigation click handler =====
  function handleLinkClick(event) {
    const link = event.target.closest("a");
    const returnBtn = event.target.closest(".return-btn");
    const element = link || returnBtn;
    if (!element) return;

    let href;
    if (returnBtn) {
      href = "./index.html";
      sessionStorage.setItem("returning-to-index", "true");
      console.log("Return button clicked - set returning-to-index flag");

      event.preventDefault();
      if (isTransitioning) return;
      isTransitioning = true;

      // ENHANCED: Multiple layers of flash prevention
      const html = document.documentElement;
      const body = document.body;

      // Layer 1: Add classes immediately
      html.classList.add("transitioning", "preload-bg");
      body.classList.add("navigating");

      // Layer 2: Set inline styles for immediate effect
      html.style.background =
        "linear-gradient(0deg, rgba(108,158,186,1) 0%, rgba(46,90,132,1) 100%)";
      body.style.background =
        "linear-gradient(0deg, rgba(108,158,186,1) 0%, rgba(46,90,132,1) 100%)";
      body.style.visibility = "hidden";
      body.style.opacity = "0";

      // Layer 3: Add theme color
      addThemeColor();

      // Layer 4: Create overlay background immediately
      createInstantBackground();

      // Layer 5: Create and show stripe overlay
      const overlay = document.createElement("div");
      overlay.id = "gradient-transition-overlay";
      overlay.innerHTML = `
        <div class="stripe stripe-1"></div>
        <div class="stripe stripe-2"></div>
        <div class="stripe stripe-3"></div>
      `;
      document.body.appendChild(overlay);

      // Start animation immediately
      requestAnimationFrame(() => animateStripesIn(overlay));

      // Navigate quickly to minimize flash window
      setTimeout(() => {
        window.location.href = href;
      }, 200); // Reduced from 300ms

      return;
    } else {
      href = link.getAttribute("href");
    }

    // Handle other navigation...
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

    if (!returnBtn) {
      sessionStorage.setItem("navigating", "true");
    }

    // Apply same flash prevention for regular navigation
    document.documentElement.classList.add("transitioning");
    document.body.classList.add("navigating");

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
    const fromBrowserNav =
      performance.navigation && performance.navigation.type === 2;
    const fromPageshow = sessionStorage.getItem("browser-nav") === "true";

    console.log(
      "Page entrance - fromTransition:",
      fromTransition,
      "fromBrowserNav:",
      fromBrowserNav,
      "fromPageshow:",
      fromPageshow
    );

    if (fromTransition && !fromBrowserNav && !fromPageshow) {
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
      const overlay = document.getElementById("gradient-transition-overlay");
      if (bg) bg.remove();
      if (overlay) overlay.remove();
    }

    // Clean up flags and styles
    sessionStorage.removeItem("navigating");
    sessionStorage.removeItem("browser-nav");

    // Remove flash prevention classes and styles
    document.documentElement.classList.remove("transitioning", "preload-bg");
    document.body.classList.remove("navigating");
    document.documentElement.style.background = "";
    document.body.style.background = "";
    document.body.style.visibility = "";
    document.body.style.opacity = "";
  }

  // ===== Init =====
  function init() {
    injectPreloaderStyles();
    document.addEventListener("click", handleLinkClick);

    // Handle browser back/forward navigation
    window.addEventListener("pageshow", function (event) {
      if (event.persisted) {
        console.log("Page restored from cache (back/forward)");
        sessionStorage.setItem("browser-nav", "true");
        handleBrowserNavigation();
      }
    });

    // Handle browser navigation using Navigation API if available
    if ("navigation" in window) {
      navigation.addEventListener("navigate", function (event) {
        if (!event.userInitiated || event.info?.source !== "script") {
          console.log("Browser navigation detected via Navigation API");
          handleBrowserNavigation();
        }
      });
    }

    // Fallback: Handle popstate (back/forward)
    window.addEventListener("popstate", function (event) {
      console.log("Popstate detected - browser navigation");
      handleBrowserNavigation();
    });

    // Handle page visibility changes
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) {
        setTimeout(() => {
          const overlay = document.getElementById(
            "gradient-transition-overlay"
          );
          const bg = document.getElementById("initial-preloader-bg");
          if (overlay) overlay.remove();
          if (bg) bg.remove();
        }, 100);
      }
    });

    if (
      sessionStorage.getItem("navigating") === "true" ||
      sessionStorage.getItem("browser-nav") === "true"
    ) {
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
