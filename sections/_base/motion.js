import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Creates a timeline for a section with responsive breakpoints and reduced-motion support.
 * @param {string} id - The section ID (matches data-hulalo-id)
 * @param {object} options - Timeline options
 * @returns {gsap.Timeline} The timeline (starts paused for editor control)
 */
export function createSectionTimeline(id, options = {}) {
  const section = document.querySelector(`[data-hulalo-id="${id}"]`);

  if (!section) {
    console.warn(`Section with id="${id}" not found`);
    return gsap.timeline();
  }

  const mm = gsap.matchMedia();
  let tl;

  mm.add({
    isDesktop: "(min-width: 992px)",
    isTablet: "(min-width: 480px) and (max-width: 991px)",
    isMobile: "(max-width: 479px)",
    reduceMotion: "(prefers-reduced-motion: reduce)"
  }, (ctx) => {
    const { reduceMotion } = ctx.conditions;

    tl = gsap.timeline({
      paused: options.paused ?? true,   // paused for editor; ScrollTrigger unpauses
      defaults: {
        duration: reduceMotion ? 0 : (options.duration ?? 0.8),
        ease: options.ease ?? "power2.out"
      },
      scrollTrigger: options.scrollTrigger !== false ? {
        trigger: section,
        start: "top 75%",
        toggleActions: "play none none reverse",
        markers: false
      } : undefined
    });

    return () => {
      tl?.kill?.();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  });

  return tl;
}

/**
 * Seeks a timeline to a specific progress (0-1).
 * Used by the editor timeline scrubber.
 */
export function seekTimeline(tl, progress) {
  if (tl) {
    tl.progress(gsap.utils.clamp(0, 1, progress));
  }
}

/**
 * Plays a timeline from the start.
 */
export function playTimeline(tl) {
  if (tl) {
    tl.restart();
    tl.play();
  }
}

/**
 * Pauses a timeline.
 */
export function pauseTimeline(tl) {
  if (tl) {
    tl.pause();
  }
}

export default { createSectionTimeline, seekTimeline, playTimeline, pauseTimeline };
