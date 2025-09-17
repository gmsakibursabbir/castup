gsap.registerPlugin(ScrollTrigger);

// General reveal function
function createRevealAnimation(className, x = 0, y = 0) {
  gsap.utils.toArray(className).forEach((el) => {
    gsap.from(el, {
      x: x,
      y: y,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%", // when element enters viewport
        toggleActions: "play none none reverse",
      },
    });
  });
}

// Call for each direction
createRevealAnimation(".reveal-left", -100, 0);
createRevealAnimation(".reveal-right", 100, 0);
createRevealAnimation(".reveal-up", 0, 100);
createRevealAnimation(".reveal-down", 0, -100);

// page animation
