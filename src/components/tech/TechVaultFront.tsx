import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { FiArrowRight, FiCpu } from "react-icons/fi";
import { SiTypescript, SiReact, SiDocker } from "react-icons/si";
import { collectionAudio } from "../certificates/audio";
import { VAULT_CONFIG } from "./techData";

interface TechVaultFrontProps {
  isOpen: boolean;
  onOpenVault: (coords: { x: number; y: number }) => void;
}

export const TechVaultFront: React.FC<TechVaultFrontProps> = ({
  isOpen,
  onOpenVault,
}) => {
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
      magXTo.current = gsap.quickTo(cardRef.current, "x", {
        duration: 0.35,
        ease: "power2.out",
      });
      magYTo.current = gsap.quickTo(cardRef.current, "y", {
        duration: 0.35,
        ease: "power2.out",
      });
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const yPct = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    const maxTilt = VAULT_CONFIG.tileTiltMaxDeg || 8;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${-yPct * maxTilt}deg) rotateY(${xPct * maxTilt}deg) translateZ(8px)`;
    cardRef.current.style.setProperty(
      "--cursor-x",
      `${((e.clientX - rect.left) / rect.width) * 100}%`
    );
    cardRef.current.style.setProperty(
      "--cursor-y",
      `${((e.clientY - rect.top) / rect.height) * 100}%`
    );

    magXTo.current?.(xPct * 6);
    magYTo.current?.(yPct * 6);
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
    setTimeout(
      () => setRipples((prev) => prev.filter((r) => r.id !== newRipple.id)),
      650
    );

    collectionAudio.playDing();
    onOpenVault({ x: clickX, y: clickY });
  };

  return (
    <div className="cert-front-stage-wrapper">
      <div ref={leftPeekRef} className="cert-peeking-hex cert-peek-left">
        <SiTypescript size={24} color="#c2a4ff" />
        <span className="peek-hex-label">TypeScript</span>
      </div>
      <div ref={rightPeekRef} className="cert-peeking-hex cert-peek-right">
        <SiReact size={24} color="#00f0ff" />
        <span className="peek-hex-label">React · Next</span>
      </div>
      <div ref={topPeekRef} className="cert-peeking-hex cert-peek-top">
        <SiDocker size={24} color="#5CC8FF" />
        <span className="peek-hex-label">Docker · OCI</span>
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
            cardRef.current.style.transform =
              "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
          }
          magXTo.current?.(0);
          magYTo.current?.(0);
        }}
        aria-expanded={isOpen}
        aria-controls="tech-vault-portal"
        data-cursor="disable"
      >
        <div className="vault-btn-shimmer" />
        <div className="cert-crystal-light-sweep" />

        {ripples.map((r) => (
          <span
            key={r.id}
            className="vault-btn-ripple"
            style={{ left: r.x, top: r.y }}
          />
        ))}

        <div className="cert-front-inner-content">
          <div className="cert-front-glyph-ring">
            <FiCpu className="cert-front-shield-icon" />
          </div>

          <div className="cert-front-mono-label">
            FULL-STACK · CLOUD · AI SYSTEMS
          </div>

          <h3 className="cert-front-title">
            Tech <span className="cert-front-title-highlight">Vault</span>
          </h3>

          <div className="cert-front-count-box">
            <span className="cert-front-count-number">41+</span>
            <span className="cert-front-count-tag">CORE TECHNOLOGIES</span>
          </div>

          <div className="cert-front-action-pill">
            <span className="cert-front-action-text">VIEW TECHNOLOGIES</span>
            <span className="vault-btn-arrow">
              <FiArrowRight />
            </span>
          </div>
        </div>
      </button>
    </div>
  );
};

export default TechVaultFront;
