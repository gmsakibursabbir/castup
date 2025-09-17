<script>
window.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const preloader = document.getElementById("preloader");
  const preloaderLogo = document.getElementById("preloader-logo");
  const headerLogo = document.getElementById("logo");

  // 3️⃣ Hero animations function
  function runHeroAnimations(callback) {
    const heroText = document.getElementById("hero-text");
    const heroCards = document.getElementById("hero-cards");
    const seeMoreBtn = document.getElementById("see-more");
    
    if (!heroText || !heroCards || !seeMoreBtn) {
      if (callback) callback();
      return;
    }

    const heroTl = gsap.timeline({
      onComplete: callback || (() => {})
    });
    
    heroTl
      .from(".cloud-left", {
        x: -120,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power3.out",
      })
      .from(
        ".cloud-right",
        {
          x: 120,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.15,
        },
        "-=0.4"
      )
      .from(heroText, {
        x: -80,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power3.out",
      })
      .from(
        heroCards,
        { x: 80, autoAlpha: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      )
      .from(
        seeMoreBtn,
        { y: 30, autoAlpha: 0, duration: 0.5, ease: "power3.out" },
        "-=0.3"
      );
  }

  // 1️⃣ Check ONLY if coming from return button - not for first time visits
  const urlParams = new URLSearchParams(window.location.search);
  const comingFromReturnBtn = sessionStorage.getItem("returning-to-index") === "true";

  console.log('Coming from return button:', comingFromReturnBtn); // Debug log

  if (comingFromReturnBtn) {
    console.log('Skipping index preloader - came from return button'); // Debug log
    
    // Hide index preloader immediately - global script already showed stripe transition
    if (preloader) {
      preloader.style.display = "none";
      preloader.style.visibility = "hidden";
      preloader.style.opacity = "0";
    }
    if (headerLogo) {
      headerLogo.style.opacity = "1";
      headerLogo.style.visibility = "visible";
    }
    
    // Ensure body overflow is not hidden
    document.body.style.overflow = "";

    // Clean up the flag
    sessionStorage.removeItem("returning-to-index");
    
    // Run hero animations immediately (no callback needed)
    runHeroAnimations();
    return;
  }

  // 2️⃣ Normal index preloader flow (first time visitors & hard refresh)
  console.log('Running normal index preloader for first time visitor/hard refresh');
  
  if (preloader && preloaderLogo && headerLogo) {
    document.body.style.overflow = "hidden";

    const headerRect = headerLogo.getBoundingClientRect();
    const preRect = preloaderLogo.getBoundingClientRect();
    const scale = Math.min(
      headerRect.width / preRect.width,
      headerRect.height / preRect.height
    );
    const x =
      headerRect.left +
      headerRect.width / 2 -
      (preRect.left + preRect.width / 2);
    const y =
      headerRect.top +
      headerRect.height / 2 -
      (preRect.top + preRect.height / 2);
    const windowHeight = window.innerHeight;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(preloader, {
          autoAlpha: 0,
          duration: 0.5,
          display: "none",
        });
        document.body.style.overflow = "";
        ScrollTrigger.refresh();
        runHeroAnimations();
      },
    });

    tl.from(preloaderLogo, {
      y: -50,
      autoAlpha: 0,
      duration: 1,
      ease: "power2.out",
    })
      .from(
        "#grass-left",
        { y: 150, autoAlpha: 0, duration: 1.2, ease: "power2.out" },
        "-=0.8"
      )
      .from(
        "#grass-right",
        { y: 150, autoAlpha: 0, duration: 1.2, ease: "power2.out" },
        "-=1"
      )
      .to({}, { duration: 1.5 }) // pause
      .to(
        ["#grass-left", "#grass-right"],
        {
          y: windowHeight,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.in",
        },
        "exit"
      )
      .to(
        preloaderLogo,
        {
          x,
          y,
          scale,
          autoAlpha: 0.9,
          duration: 0.8,
          ease: "power3.inOut",
          onComplete: () => {
            preloaderLogo.style.display = "none";
            headerLogo.style.opacity = 1;
          },
        },
        "exit+=0.2"
      );
  } else {
    // Fallback if elements don't exist
    document.body.style.overflow = "";
    runHeroAnimations();
  }

  // 4️⃣ Return button handler - Remove this from index page
  // This should only be on OTHER pages, not index page
  // The global script handles return button clicks
});
</script>