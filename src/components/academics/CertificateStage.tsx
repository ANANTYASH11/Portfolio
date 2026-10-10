import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ACADEMICS_CONFIG, ACADEMIC_FACTS } from "./academicsConfig";

interface CertificateStageProps {
  children: React.ReactNode;
  spotlightIntensity?: number;
}

export const CertificateStage: React.FC<CertificateStageProps> = ({
  children,
  spotlightIntensity = ACADEMICS_CONFIG.spotlightIntensity ?? 0.18,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const arcsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (isReducedMotion || !arcsRef.current) return;

    // Slow aperture counter-rotation (60s loop)
    const ctx = gsap.context(() => {
      gsap.to(".aperture-arc-outer", {
        rotation: 360,
        duration: ACADEMICS_CONFIG.arcSpeed || 60,
        repeat: -1,
        ease: "none",
      });
      gsap.to(".aperture-arc-middle", {
        rotation: -360,
        duration: (ACADEMICS_CONFIG.arcSpeed || 60) * 1.3,
        repeat: -1,
        ease: "none",
      });
      gsap.to(".aperture-arc-inner", {
        rotation: 360,
        duration: (ACADEMICS_CONFIG.arcSpeed || 60) * 0.8,
        repeat: -1,
        ease: "none",
      });
    }, arcsRef);

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
    <div ref={stageRef} className="museum-stage-wrapper">
      {/* ─── 1. Overhead Museum Spotlight Cone ─── */}
      <div
        className="stage-spotlight-cone"
        style={{
          opacity: spotlightIntensity,
        }}
        aria-hidden="true"
      />

      {/* ─── 2. Concentric Aperture Arcs (Ambient Counter-Rotation) ─── */}
      <div ref={arcsRef} className="stage-aperture-arcs" aria-hidden="true">
        <div className="aperture-arc aperture-arc-outer" />
        <div className="aperture-arc aperture-arc-middle" />
        <div className="aperture-arc aperture-arc-inner" />
      </div>

      {/* ─── 3. Quiet Mono Vertical Side Labels ─── */}
      <div className="stage-side-label left-label" aria-hidden="true">
        <span>IIT GUWAHATI · DAKSH GURUKUL</span>
      </div>

      <div className="stage-side-label right-label" aria-hidden="true">
        <span>REF DG/IITG/CSE/2024-2025/C0232</span>
      </div>

      {/* ─── 4. Fanned Background Cards (-4deg and +4deg) ─── */}
      <div
        className="stage-fanned-cards-wrapper"
        onClick={handleScrollToVault}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleScrollToVault();
          }
        }}
        aria-label="View all 18 credentials in the Certificate Vault"
        title="View all 18 credentials in the Certificate Vault"
      >
        <div className="fanned-card fanned-card-left" aria-hidden="true">
          <div className="fanned-card-preview" />
        </div>
        <div className="fanned-card fanned-card-right" aria-hidden="true">
          <div className="fanned-card-preview" />
        </div>
      </div>

      {/* ─── 5. The Main Hero Certificate Object (Passed as children) ─── */}
      <div className="stage-center-pedestal">{children}</div>

      {/* ─── 6. Faint Mirrored Floor Reflection & Contact Shadow ─── */}
      <div className="stage-floor-reflection-zone" aria-hidden="true">
        <div className="stage-contact-shadow" />
        <div
          className="stage-floor-mirrored-reflection"
          style={{ opacity: ACADEMICS_CONFIG.floorReflectionOpacity ?? 0.08 }}
        >
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
          <div className="stage-reflection-fade-mask" />
        </div>
      </div>
    </div>
  );
};

export default CertificateStage;
