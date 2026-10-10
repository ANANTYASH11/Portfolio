import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

// ============================================================================
// VAULT MOTION CONFIG — All Tunables in One Place
// ============================================================================
export const VAULT_MOTION_CONFIG = {
  // Title reveal
  titleStagger: 0.03,
  titleDuration: 1.0,
  titleEase: "expo.out",
  titleRotate: 6,
  titleYPercent: 110,
  titleSweepDuration: 1.2,

  // Eyebrow & Odometer
  dotPulseDuration: 2.0,
  odometerDuration: 1.2,

  // Progress Bar
  progressDuration: 1.4,
  progressEase: "power4.out",
  progressShimmerInterval: 5.0,

  // Tabs
  tabSlideDuration: 0.42,
  tabSlideEase: "power3.out",
  chipBounceDuration: 0.38,

  // Cards Deal-in Entrance
  dealStartX: -120,
  dealStartY: -140,
  dealStartRotate: -18,
  dealDuration: 0.7,
  dealStagger: 0.06,
  dealEase: "back.out(1.5)",

  // Card Hover & 3D Tilt
  hoverLiftY: -10,
  hoverTiltMax: 7,
  hoverSheenDuration: 0.75,
  hoverBobY: -4,
  siblingDimOpacity: 0.6,
  siblingScale: 0.98,
  titleMorphDuration: 0.35,

  // Filter Flip
  filterGlideDuration: 0.45,
  filterEnterEase: "back.out(1.4)",

  // Mascot
  mascotBlinkMinSec: 3,
  mascotBlinkMaxSec: 6,
  mascotBounceDuration: 0.6,

  // Header Magnetic Controls
  magneticMaxPull: 6,
  closeRotateDeg: 90,
  resetSpinDeg: 360,

  // Ambient Glow
  ambientGlowRadius: 500,
  ambientGlowOpacity: 0.08,
};

// Check motion preferences and input capability
export const getMotionCapabilities = () => {
  if (typeof window === "undefined") {
    return { prefersReducedMotion: false, isTouch: false };
  }
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
  return { prefersReducedMotion, isTouch };
};

// ============================================================================
// HOOK: useVaultAnimations
// ============================================================================
export function useVaultAnimations() {
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    ctxRef.current = gsap.context(() => {});
    return () => {
      ctxRef.current?.revert();
    };
  }, []);

  // 1. Title Reveal Animation
  const animateTitleReveal = useCallback((container: HTMLElement | null) => {
    if (!container) return;
    const { prefersReducedMotion } = getMotionCapabilities();
    const chars = container.querySelectorAll(".vault-title-char");
    const vaultWord = container.querySelector(".vault-title-vault") as HTMLElement | null;

    if (prefersReducedMotion) {
      gsap.set(chars, { yPercent: 0, rotate: 0, opacity: 1 });
      vaultWord?.classList.add("vault-sweep");
      return;
    }

    if (chars.length > 0) {
      gsap.fromTo(
        chars,
        {
          yPercent: VAULT_MOTION_CONFIG.titleYPercent,
          rotate: VAULT_MOTION_CONFIG.titleRotate,
          opacity: 0,
        },
        {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          duration: VAULT_MOTION_CONFIG.titleDuration,
          stagger: VAULT_MOTION_CONFIG.titleStagger,
          ease: VAULT_MOTION_CONFIG.titleEase,
          onComplete: () => {
            if (vaultWord) {
              vaultWord.classList.remove("vault-sweep");
              void vaultWord.offsetWidth;
              vaultWord.classList.add("vault-sweep");
            }
          },
        }
      );
    }
  }, []);

  // 2. Eyebrow Odometer Roll
  const animateOdometer = useCallback(
    (element: HTMLElement | null, targetNumber: number, suffix = " CREDENTIALS") => {
      if (!element) return;
      const { prefersReducedMotion } = getMotionCapabilities();

      if (prefersReducedMotion) {
        element.textContent = `${targetNumber}${suffix}`;
        return;
      }

      const obj = { count: 0 };
      gsap.to(obj, {
        count: targetNumber,
        duration: VAULT_MOTION_CONFIG.odometerDuration,
        ease: "power2.out",
        onUpdate: () => {
          element.textContent = `${Math.round(obj.count)}${suffix}`;
        },
      });
    },
    []
  );

  // 3. Progress Bar Fill + Shimmer
  const animateProgressBar = useCallback(
    (
      bar: HTMLElement | null,
      pct: number,
      ratioElement: HTMLElement | null,
      totalCount = 18,
      maxCount = "25+"
    ) => {
      if (!bar) return;
      const { prefersReducedMotion } = getMotionCapabilities();

      if (prefersReducedMotion) {
        bar.style.width = `${pct}%`;
        if (ratioElement) ratioElement.textContent = `${totalCount} / ${maxCount} AVAILABLE`;
        return;
      }

      gsap.fromTo(
        bar,
        { width: "0%" },
        {
          width: `${pct}%`,
          duration: VAULT_MOTION_CONFIG.progressDuration,
          ease: VAULT_MOTION_CONFIG.progressEase,
          delay: 0.15,
        }
      );

      if (ratioElement) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: totalCount,
          duration: VAULT_MOTION_CONFIG.progressDuration,
          ease: "power2.out",
          delay: 0.15,
          onUpdate: () => {
            ratioElement.textContent = `${Math.round(obj.val)} / ${maxCount} AVAILABLE`;
          },
        });
      }
    },
    []
  );

  // 4. Tabs Slide Indicator + Count Chip Bounce
  const animateTabSlide = useCallback(
    (indicator: HTMLElement | null, targetTab: HTMLElement | null, chipElement?: HTMLElement | null) => {
      if (!indicator || !targetTab) return;
      const { prefersReducedMotion } = getMotionCapabilities();

      const targetX = targetTab.offsetLeft;
      const targetWidth = targetTab.offsetWidth;

      if (prefersReducedMotion) {
        gsap.set(indicator, { x: targetX, width: targetWidth });
      } else {
        gsap.to(indicator, {
          x: targetX,
          width: targetWidth,
          duration: VAULT_MOTION_CONFIG.tabSlideDuration,
          ease: VAULT_MOTION_CONFIG.tabSlideEase,
        });
      }

      if (chipElement && !prefersReducedMotion) {
        gsap.fromTo(
          chipElement,
          { scale: 1.35 },
          {
            scale: 1,
            duration: VAULT_MOTION_CONFIG.chipBounceDuration,
            ease: "back.out(3)",
          }
        );
      }
    },
    []
  );

  // 5. Cards Deal-in Entrance
  const animateCardDealEntrance = useCallback(
    (cards: HTMLElement[] | NodeListOf<Element> | null, getAngle?: (i: number) => number) => {
      if (!cards || cards.length === 0) return;
      const { prefersReducedMotion } = getMotionCapabilities();

      if (prefersReducedMotion) {
        gsap.set(cards, { opacity: 1, x: 0, y: 0, scale: 1, rotation: 0 });
        return;
      }

      gsap.fromTo(
        cards,
        {
          x: VAULT_MOTION_CONFIG.dealStartX,
          y: VAULT_MOTION_CONFIG.dealStartY,
          rotation: VAULT_MOTION_CONFIG.dealStartRotate,
          opacity: 0,
          scale: 0.7,
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: (i) => (getAngle ? getAngle(i) : 0),
          duration: VAULT_MOTION_CONFIG.dealDuration,
          stagger: VAULT_MOTION_CONFIG.dealStagger,
          ease: VAULT_MOTION_CONFIG.dealEase,
        }
      );
    },
    []
  );

  // 6. Magnetic Header Button
  const createMagneticController = useCallback((element: HTMLElement | null) => {
    if (!element) return () => {};
    const { prefersReducedMotion, isTouch } = getMotionCapabilities();
    if (prefersReducedMotion || isTouch) return () => {};

    const xTo = gsap.quickTo(element, "x", { duration: 0.3, ease: "power2.out" });
    const yTo = gsap.quickTo(element, "y", { duration: 0.3, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * 0.25;
      const deltaY = (e.clientY - centerY) * 0.25;
      const maxPull = VAULT_MOTION_CONFIG.magneticMaxPull;
      xTo(Math.max(-maxPull, Math.min(maxPull, deltaX)));
      yTo(Math.max(-maxPull, Math.min(maxPull, deltaY)));
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
      xTo(0);
      yTo(0);
    };
  }, []);

  // 7. Ambient Violet Glow Tracker
  const createAmbientGlowController = useCallback((stage: HTMLElement | null, glow: HTMLElement | null) => {
    if (!stage || !glow) return () => {};
    const { prefersReducedMotion, isTouch } = getMotionCapabilities();
    if (prefersReducedMotion || isTouch) {
      glow.style.display = "none";
      return () => {};
    }

    const xTo = gsap.quickTo(glow, "x", { duration: 0.5, ease: "power2.out" });
    const yTo = gsap.quickTo(glow, "y", { duration: 0.5, ease: "power2.out" });

    const handlePointerMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      xTo(e.clientX - rect.left);
      yTo(e.clientY - rect.top);
    };

    stage.addEventListener("pointermove", handlePointerMove);
    return () => {
      stage.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return {
    config: VAULT_MOTION_CONFIG,
    animateTitleReveal,
    animateOdometer,
    animateProgressBar,
    animateTabSlide,
    animateCardDealEntrance,
    createMagneticController,
    createAmbientGlowController,
  };
}

export default useVaultAnimations;
