import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ACADEMICS_CONFIG, ACADEMIC_FACTS } from "./academicsConfig";

gsap.registerPlugin(ScrollTrigger);

export const CertificateBackdrop: React.FC = () => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const outlineTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.innerWidth < 1100;
    if (isReducedMotion || isMobile) return;

    const el = backdropRef.current;
    const textEl = outlineTextRef.current;
    if (!el || !textEl) return;

    // Drifting 40px with scroll (parallax)
    const ctx = gsap.context(() => {
      gsap.to(textEl, {
        y: 40,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }, el);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleScrollToVault = () => {
    const vaultEl = document.getElementById("certificate-vault-section");
    if (vaultEl) {
      vaultEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div ref={backdropRef} className="certificate-backdrop-container" aria-hidden="true">
      {/* ─── 1. Giant Outlined "IIT G" (1px stroke at white 4%, 40px parallax drift) ─── */}
      <div ref={outlineTextRef} className="backdrop-outline-text">
        <span>IIT G</span>
      </div>

      {/* ─── 2. Soft Violet Spotlight Cone from Above (16% opacity) ─── */}
      <div
        className="backdrop-spotlight-cone"
        style={{
          opacity: ACADEMICS_CONFIG.spotlightOpacity ?? 0.16,
        }}
      />

      {/* ─── 3. Two Faint Dark Cards Fanned at -4deg and +4deg (30% opacity) ─── */}
      <div
        className="backdrop-fanned-cards"
        onClick={handleScrollToVault}
        role="button"
        tabIndex={-1}
        title="View all 18 credentials in the Certificate Vault"
      >
        <div className="backdrop-fanned-card card-left" />
        <div className="backdrop-fanned-card card-right" />
      </div>

      {/* ─── 4. Faint Floor Reflection Under Certificate (8% opacity) ─── */}
      <div className="backdrop-floor-reflection">
        <picture>
          <source type="image/webp" srcSet="/images/minor-degree.webp" />
          <img
            src={ACADEMIC_FACTS.certificateImg}
            alt=""
            width={1730}
            height={1180}
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div className="backdrop-reflection-fade" />
      </div>
    </div>
  );
};

export default CertificateBackdrop;
