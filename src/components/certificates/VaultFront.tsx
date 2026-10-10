import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { FiArrowRight } from "react-icons/fi";
import { LuShieldCheck } from "react-icons/lu";
import { MdSchool } from "react-icons/md";
import { VAULT_CONFIG, OracleGlyph } from "./certificates";
import { collectionAudio } from "./audio";

interface VaultFrontProps {
  isOpen: boolean;
  onOpenVault: (coords: { x: number; y: number }) => void;
}

export const VaultFront: React.FC<VaultFrontProps> = ({ isOpen, onOpenVault }) => {
  const cardRef = useRef<HTMLButtonElement>(null);
  const leftPeekRef = useRef<HTMLDivElement>(null);
  const rightPeekRef = useRef<HTMLDivElement>(null);
  const topPeekRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const magXTo = useRef<gsap.QuickToFunc | null>(null);
  const magYTo = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion && !isTouch && cardRef.current) {
      magXTo.current = gsap.quickTo(cardRef.current, "x", { duration: 0.35, ease: "power2.out" });
      magYTo.current = gsap.quickTo(cardRef.current, "y", { duration: 0.35, ease: "power2.out" });
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const yPct = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    const maxTilt = VAULT_CONFIG.frontTiltMaxDeg || 6; // max 6deg 3D tilt

    cardRef.current.style.transform = `perspective(1400px) rotateX(${-yPct * maxTilt}deg) rotateY(${xPct * maxTilt}deg) translateZ(6px)`;
    cardRef.current.style.setProperty("--cursor-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    cardRef.current.style.setProperty("--cursor-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);

    magXTo.current?.(xPct * (VAULT_CONFIG.magneticButtonStrength || 4)); // 4px magnetic drift
    magYTo.current?.(yPct * (VAULT_CONFIG.magneticButtonStrength || 4));
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    const clickX = e.clientX || (rect ? rect.left + rect.width / 2 : window.innerWidth / 2);
    const clickY = e.clientY || (rect ? rect.top + rect.height / 2 : window.innerHeight / 2);

    const newRipple = {
      id: Date.now(),
      x: e.clientX - (rect?.left || 0),
      y: e.clientY - (rect?.top || 0),
    };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== newRipple.id)), 650);

    collectionAudio.playDing();
    onOpenVault({ x: clickX, y: clickY });
  };

  return (
    <div className="cert-front-stage-wrapper">
      {/* Three Faint Hex Outlines Peeking Behind in Calm Violet/Lavender */}
      <div ref={leftPeekRef} className="cert-peeking-hex cert-peek-left">
        <OracleGlyph size={24} color="#c4b5fd" />
        <span className="peek-hex-label">Oracle AI</span>
      </div>
      <div ref={rightPeekRef} className="cert-peeking-hex cert-peek-right">
        <MdSchool size={24} color="#8b5cf6" />
        <span className="peek-hex-label">IIT Guwahati</span>
      </div>
      <div ref={topPeekRef} className="cert-peeking-hex cert-peek-top">
        <LuShieldCheck size={24} color="#c4b5fd" strokeWidth={1.5} />
        <span className="peek-hex-label">Verified 100%</span>
      </div>

      <button
        ref={cardRef}
        type="button"
        className="cert-front-crystal-card"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => collectionAudio.playPop()}
        onMouseLeave={() => {
          if (cardRef.current) {
            cardRef.current.style.transform = "perspective(1400px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
          }
          magXTo.current?.(0);
          magYTo.current?.(0);
        }}
        aria-expanded={isOpen}
        aria-controls="certificate-vault-portal"
        aria-label="Certificate Vault. 18 credentials verified at source. Click to unlock honeycomb vault."
        data-cursor="disable"
      >
        {/* Shimmer sweep every 4s */}
        <div className="vault-btn-shimmer" />
        <div className="cert-crystal-light-sweep" />

        {ripples.map((r) => (
          <span key={r.id} className="vault-btn-ripple" style={{ left: r.x, top: r.y }} />
        ))}

        <div className="cert-front-inner-content">
          {/* Shield-check icon in thin hairline ring */}
          <div className="cert-front-glyph-ring">
            <LuShieldCheck className="cert-front-shield-icon" strokeWidth={1.5} />
          </div>

          {/* Calm 11px uppercase label font */}
          <div className="cert-front-mono-label">ORACLE · IIT · INTERNSHIPS</div>

          {/* Heading Font with italic gradient "Vault" */}
          <h3 className="cert-front-title">
            Certificate <span className="cert-front-title-highlight">Vault</span>
          </h3>

          {/* Count-up 25+ */}
          <div className="cert-front-count-box">
            <span className="cert-front-count-number">25+</span>
            <span className="cert-front-count-tag">VERIFIED CREDENTIALS</span>
          </div>

          {/* Pill button: VIEW CREDENTIALS with 3px arrow nudge */}
          <div className="cert-front-action-pill">
            <span className="cert-front-action-text">VIEW CREDENTIALS</span>
            <span className="vault-btn-arrow">
              <FiArrowRight />
            </span>
          </div>
        </div>
      </button>
    </div>
  );
};

export default VaultFront;
