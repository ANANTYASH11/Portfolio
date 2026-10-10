import React, { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiShield } from "react-icons/fi";
import { ACADEMICS_CONFIG, ACADEMIC_FACTS } from "./academicsConfig";

gsap.registerPlugin(ScrollTrigger);

interface HeroCertificateProps {
  isDetailsOpen: boolean;
  onOpenLightbox: (doc?: "certificate" | "transcript") => void;
  containerRef?: React.RefObject<HTMLDivElement>;
  isGlowActive?: boolean;
}

export const HeroCertificate: React.FC<HeroCertificateProps> = ({
  isDetailsOpen,
  onOpenLightbox,
  containerRef,
  isGlowActive = false,
}) => {
  const localContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const triggerRef = containerRef || localContainerRef;

  // quickTo references for fluid 60fps cursor tilt with layer parallax
  const quickRotateX = useRef<gsap.QuickToFunc | null>(null);
  const quickRotateY = useRef<gsap.QuickToFunc | null>(null);
  const quickPaperX = useRef<gsap.QuickToFunc | null>(null);
  const quickPaperY = useRef<gsap.QuickToFunc | null>(null);
  const quickSealX = useRef<gsap.QuickToFunc | null>(null);
  const quickSealY = useRef<gsap.QuickToFunc | null>(null);

  // Handle cursor tracking for 3D tilt & glare highlight
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 1100) return;
    if (!cardRef.current || !glareRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;

    const tiltX = -percentY * ACADEMICS_CONFIG.tiltMaxDeg;
    const tiltY = percentX * ACADEMICS_CONFIG.tiltMaxDeg;

    // Frame 1x tilt
    if (quickRotateX.current && quickRotateY.current) {
      quickRotateX.current(tiltX);
      quickRotateY.current(tiltY);
    }

    // Parallax layers: Paper 1.5x, Seal 2.5x
    if (quickPaperX.current && quickPaperY.current) {
      quickPaperX.current(percentX * 4);
      quickPaperY.current(percentY * 4);
    }
    if (quickSealX.current && quickSealY.current) {
      quickSealX.current(percentX * 8);
      quickSealY.current(percentY * 8);
    }

    // Move soft diagonal glare across paper
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    glareRef.current.style.setProperty("--glare-x", `${glareX}%`);
    glareRef.current.style.setProperty("--glare-y", `${glareY}%`);
    glareRef.current.style.opacity = `${ACADEMICS_CONFIG.glareOpacity}`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (quickRotateX.current && quickRotateY.current) {
      quickRotateX.current(0);
      quickRotateY.current(0);
    }
    if (quickPaperX.current && quickPaperY.current) {
      quickPaperX.current(0);
      quickPaperY.current(0);
    }
    if (quickSealX.current && quickSealY.current) {
      quickSealX.current(0);
      quickSealY.current(0);
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = "0";
    }
  }, []);

  useEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const isReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.innerWidth < 1100;

    const ctx = gsap.context(() => {
      // Setup quickTo setters for 3D tilt & parallax layers
      quickRotateX.current = gsap.quickTo(cardEl, "rotationX", {
        duration: ACADEMICS_CONFIG.tiltQuickToDuration,
        ease: "power2.out",
      });
      quickRotateY.current = gsap.quickTo(cardEl, "rotationY", {
        duration: ACADEMICS_CONFIG.tiltQuickToDuration,
        ease: "power2.out",
      });

      if (paperRef.current) {
        quickPaperX.current = gsap.quickTo(paperRef.current, "x", { duration: 0.35 });
        quickPaperY.current = gsap.quickTo(paperRef.current, "y", { duration: 0.35 });
      }
      if (sealRef.current) {
        quickSealX.current = gsap.quickTo(sealRef.current, "x", { duration: 0.35 });
        quickSealY.current = gsap.quickTo(sealRef.current, "y", { duration: 0.35 });
      }

      // ─── 1. Scroll Entrance Animation ───
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

      if (isReducedMotion) {
        entranceTl.fromTo(
          cardEl,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: "power2.out" }
        );
      } else {
        entranceTl.fromTo(
          cardEl,
          {
            scale: ACADEMICS_CONFIG.entranceScaleStart,
            rotationX: ACADEMICS_CONFIG.entranceRotateX,
            y: ACADEMICS_CONFIG.entranceY,
            opacity: 0,
            transformPerspective: ACADEMICS_CONFIG.entrancePerspective,
          },
          {
            scale: 1,
            rotationX: 0,
            y: 0,
            opacity: 1,
            duration: ACADEMICS_CONFIG.entranceDuration,
            ease: ACADEMICS_CONFIG.entranceEase,
          }
        );

        // Light sweep across certificate paper
        if (sweepRef.current) {
          entranceTl.fromTo(
            sweepRef.current,
            { xPercent: -120, opacity: 0 },
            {
              xPercent: 140,
              opacity: 0.7,
              duration: 1.1,
              ease: "power2.inOut",
            },
            "-=0.4"
          );
        }

        // ─── 2. Idle Ambient Floating (±6px, 6s loop) ───
        if (!isMobile) {
          gsap.to(cardEl, {
            y: `+=${ACADEMICS_CONFIG.floatY}`,
            duration: ACADEMICS_CONFIG.floatDuration / 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: ACADEMICS_CONFIG.entranceDuration + 0.2,
          });
        }
      }
    }, triggerRef);

    return () => {
      ctx.revert();
    };
  }, [triggerRef]);

  return (
    <div
      ref={triggerRef}
      className={`hero-cert-stage ${isDetailsOpen ? "details-unfolded" : ""} ${
        isGlowActive ? "rail-hover-glow" : ""
      }`}
    >
      {/* 3D Transform & Tilt Wrapper inside Bevelled Museum Frame */}
      <div
        ref={cardRef}
        id="hero-certificate-card"
        className="hero-cert-card museum-frame"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onOpenLightbox("certificate")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpenLightbox("certificate");
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Inspect verified IIT Guwahati certificate in full-screen high-resolution lightbox"
      >
        {/* Layer 1: Dark Outer Museum Mat */}
        <div className="cert-museum-mat" aria-hidden="true" />

        {/* Layer 2: Paper Layer with Tone Filter & Subtle Grain */}
        <div ref={paperRef} className="hero-cert-paper-layer">
          <picture>
            <source type="image/webp" srcSet="/images/minor-degree.webp" />
            <img
              src={ACADEMIC_FACTS.certificateImg}
              alt="IIT Guwahati Credit-Linked Computer Science & Engineering Certificate awarded to Anant Yash (ID: IITGCS_24061332)"
              className="hero-cert-image paper-toned"
              width={1730}
              height={1180}
              loading="lazy"
              decoding="async"
            />
          </picture>
          <div className="cert-vignette-overlay" aria-hidden="true" />
          <div className="cert-paper-grain" aria-hidden="true" />
        </div>

        {/* Layer 3: Cyan Pinned Verified Credential Badge with Parallax */}
        <div
          ref={sealRef}
          className="hero-cert-badge-pill foil-seal"
          aria-label="Verified Credential"
        >
          <FiShield className="badge-shield-icon" aria-hidden="true" />
          <span className="badge-text">VERIFIED CREDENTIAL</span>
          <span className="badge-pulse-dot" aria-hidden="true" />
        </div>

        {/* Light Sweep Highlight Overlay */}
        <div ref={sweepRef} className="hero-cert-sweep" aria-hidden="true" />

        {/* Dynamic Diagonal Glare Layer */}
        <div ref={glareRef} className="hero-cert-glare" aria-hidden="true" />
      </div>
    </div>
  );
};

export default HeroCertificate;
