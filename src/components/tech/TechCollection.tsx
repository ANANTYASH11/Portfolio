import React, { useState, useRef, useCallback, useEffect } from "react";
import gsap from "gsap";
import TechVaultFront from "./TechVaultFront";
import TechVaultBack from "./TechVaultBack";
import { VAULT_CONFIG } from "./techData";
import "../certificates/tokens.css";
import "../styles/vault.css";

export const TechCollection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const shockwaveRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLDivElement>(null);

  const handleOpenVault = useCallback((coords: { x: number; y: number }) => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Expand soft violet shockwave ring from click origin
    if (shockwaveRef.current) {
      const ring = shockwaveRef.current;
      ring.style.left = `${coords.x}px`;
      ring.style.top = `${coords.y}px`;
      gsap.fromTo(
        ring,
        { scale: 0, opacity: 0.7 },
        {
          scale: 16,
          opacity: 0,
          duration: VAULT_CONFIG.shockwaveDuration || 1.1,
          ease: "power2.out",
        }
      );
    }

    // Flip morph card: rotateY 0 -> 90deg, then swap, -90deg -> 0deg with elastic power3.out
    if (stageRef.current && !prefersReducedMotion) {
      gsap.to(stageRef.current, {
        rotateY: 90,
        scale: 0.95,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          setIsOpen(true);
          if (stageRef.current) {
            gsap.fromTo(
              stageRef.current,
              { rotateY: -90, scale: 0.95 },
              {
                rotateY: 0,
                scale: 1,
                duration: 0.55,
                ease: "power3.out",
              }
            );
          }
        },
      });
    } else {
      setIsOpen(true);
    }
  }, []);

  const handleCloseVault = useCallback(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (stageRef.current && !prefersReducedMotion) {
      gsap.to(stageRef.current, {
        rotateY: -90,
        scale: 0.95,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          setIsOpen(false);
          if (stageRef.current) {
            gsap.fromTo(
              stageRef.current,
              { rotateY: 90, scale: 0.95 },
              {
                rotateY: 0,
                scale: 1,
                duration: 0.45,
                ease: "power3.out",
                onComplete: () => {
                  const frontBtn = triggerButtonRef.current?.querySelector("button");
                  frontBtn?.focus();
                },
              }
            );
          } else {
            const frontBtn = triggerButtonRef.current?.querySelector("button");
            frontBtn?.focus();
          }
        },
      });
    } else {
      setIsOpen(false);
      const frontBtn = triggerButtonRef.current?.querySelector("button");
      frontBtn?.focus();
    }
  }, []);

  // Keyboard Escape listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleCloseVault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleCloseVault]);

  return (
    <div
      className={`cert-vault-wrapper-root ${isOpen ? "vault-is-open" : "vault-is-closed"}`}
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Expanding Soft Violet Shockwave Ring */}
      <div
        ref={shockwaveRef}
        className="vault-soft-shockwave"
        style={{
          position: "fixed",
          width: "80px",
          height: "80px",
          marginLeft: "-40px",
          marginTop: "-40px",
          borderRadius: "50%",
          border: "2px solid #8b5cf6",
          boxShadow: "0 0 30px rgba(139, 92, 246, 0.6), inset 0 0 20px rgba(196, 181, 253, 0.4)",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0,
        }}
        aria-hidden="true"
      />

      {/* 3D Perspective Flipper Stage */}
      <div
        ref={stageRef}
        className="cert-3d-flipper-stage"
        style={{
          perspective: "1400px",
          transformStyle: "preserve-3d",
          width: "100%",
        }}
      >
        {!isOpen ? (
          <div ref={triggerButtonRef} className="cert-flipper-front-wrapper">
            <TechVaultFront isOpen={isOpen} onOpenVault={handleOpenVault} />
          </div>
        ) : (
          <div className="cert-flipper-back-wrapper">
            <TechVaultBack isOpen={isOpen} onClose={handleCloseVault} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TechCollection;
