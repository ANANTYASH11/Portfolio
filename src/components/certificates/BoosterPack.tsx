import React, { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { collectionAudio } from "./audio";
import { COLLECTION_CONFIG } from "./certificates";
import "./tokens.css";

interface BoosterPackProps {
  onUnwrap: () => void;
  isUnwrapping: boolean;
  onEasterEggConfetti?: () => void;
}

export const BoosterPack: React.FC<BoosterPackProps> = ({
  onUnwrap,
  isUnwrapping,
  onEasterEggConfetti,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const packRef = useRef<HTMLButtonElement>(null);
  const tearTopRef = useRef<HTMLDivElement>(null);
  const teaserLeftRef = useRef<HTMLDivElement>(null);
  const teaserRightRef = useRef<HTMLDivElement>(null);

  const [clickCount, setClickCount] = useState(0);
  const [easterEggToast, setEasterEggToast] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check prefers-reduced-motion
  const isReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Idle Gentle Wobble Every 3.5s (Respects reduced motion)
  useEffect(() => {
    if (isUnwrapping || isReducedMotion) return;

    const wobbleInterval = setInterval(() => {
      if (!packRef.current || isHovered) return;
      gsap.to(packRef.current, {
        rotation: (Math.random() - 0.5) * 1.5,
        duration: 0.7,
        ease: "power2.inOut",
        yoyo: true,
        repeat: 1,
      });
    }, (COLLECTION_CONFIG.pack.wobbleInterval || 3.5) * 1000);

    return () => clearInterval(wobbleInterval);
  }, [isUnwrapping, isHovered, isReducedMotion]);

  // Step 2: The Unwrap Animation (Tear Off & Fly Away)
  useEffect(() => {
    if (!isUnwrapping || !packRef.current) return;

    collectionAudio.playDing();

    if (isReducedMotion) {
      // Clean immediate fade for reduced motion
      gsap.to(packRef.current, { opacity: 0, duration: 0.4 });
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Refined small shake (±4px, ±2deg)
      gsap.to(packRef.current, {
        x: () => (Math.random() - 0.5) * 4,
        rotation: () => (Math.random() - 0.5) * 2,
        duration: 0.08,
        repeat: 4,
        yoyo: true,
        ease: "power1.inOut",
        onComplete: () => {
          // 2. Zig-zag top tears off and flies away
          if (tearTopRef.current) {
            gsap.to(tearTopRef.current, {
              y: -100,
              x: 60,
              rotation: 90,
              opacity: 0,
              duration: 0.55,
              ease: "power2.out",
            });
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isUnwrapping, isReducedMotion]);

  // Hover: Refined Wiggle (max 1.5deg, max 1.1 overshoot) & Teasers Peek Out
  const handleMouseEnter = useCallback(() => {
    if (isUnwrapping || !packRef.current) return;
    setIsHovered(true);
    collectionAudio.playPop();

    if (isReducedMotion) return;

    gsap.to(packRef.current, {
      rotation: 1.5,
      duration: 0.25,
      ease: "back.out(1.1)",
      yoyo: true,
      repeat: 2,
    });

    if (teaserLeftRef.current && teaserRightRef.current) {
      gsap.to(teaserLeftRef.current, {
        y: -18,
        rotation: -9,
        duration: 0.35,
        ease: "back.out(1.1)",
      });
      gsap.to(teaserRightRef.current, {
        y: -18,
        rotation: 9,
        duration: 0.35,
        ease: "back.out(1.1)",
      });
    }
  }, [isUnwrapping, isReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    if (isUnwrapping || !packRef.current) return;
    setIsHovered(false);

    gsap.to(packRef.current, {
      rotation: 0,
      scale: 1,
      duration: 0.25,
      ease: "power2.out",
    });

    if (teaserLeftRef.current && teaserRightRef.current) {
      gsap.to([teaserLeftRef.current, teaserRightRef.current], {
        y: 0,
        rotation: (i) => (i === 0 ? -8 : 8),
        duration: 0.25,
        ease: "power2.inOut",
      });
    }
  }, [isUnwrapping]);

  // Easter Egg: Click "25+" numeral 5 times
  const handleNumClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    collectionAudio.playPop();

    if (nextCount >= 5) {
      setClickCount(0);
      setEasterEggToast(true);
      if (onEasterEggConfetti) onEasterEggConfetti();
      setTimeout(() => setEasterEggToast(false), 3000);
    }
  };

  return (
    <div ref={containerRef} className="booster-stage-wrap">
      <div className="booster-pack-anchor pack-idle-float">
        {/* Tape Strips: lavender at 25% opacity with 1px lavender 40% border */}
        <div className="washi-tape washi-tape-top-left" />
        <div className="washi-tape washi-tape-bottom-right" />

        {/* 2 Teaser Cards Peeking Out Behind: one violet #8b5cf6, one lavender #c4b5fd at 80% */}
        <div
          ref={teaserLeftRef}
          className="teaser-peek-card teaser-peek-left"
          aria-hidden="true"
        >
          <span style={{ fontFamily: "var(--candy-font-mono)", fontSize: "10px", color: "#0b0912", fontWeight: 800 }}>
            ★ LEGENDARY
          </span>
          <div style={{ fontFamily: "var(--candy-font-body)", color: "#0b0912", fontSize: "12px", fontWeight: 700, marginTop: "2px" }}>
            GenAI Pro
          </div>
        </div>

        <div
          ref={teaserRightRef}
          className="teaser-peek-card teaser-peek-right"
          aria-hidden="true"
        >
          <span style={{ fontFamily: "var(--candy-font-mono)", fontSize: "10px", color: "#0b0912", fontWeight: 800 }}>
            ★ LEGENDARY
          </span>
          <div style={{ fontFamily: "var(--candy-font-body)", color: "#0b0912", fontSize: "12px", fontWeight: 700, marginTop: "2px" }}>
            DevOps Pro
          </div>
        </div>

        {/* Sparkles Twinkling on Hover */}
        {isHovered && !isReducedMotion && (
          <>
            <span className="sparkle-particle" style={{ top: "-15px", left: "-20px" }}>✦</span>
            <span className="sparkle-particle" style={{ top: "40px", right: "-25px", animationDelay: "0.4s" }}>★</span>
            <span className="sparkle-particle" style={{ bottom: "30px", left: "-22px", animationDelay: "0.8s" }}>✦</span>
          </>
        )}

        {/* The Booster Pack Card (Accessible <button> with aria-expanded & aria-controls) */}
        <button
          ref={packRef}
          type="button"
          onClick={onUnwrap}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="booster-pack-card"
          aria-expanded={false}
          aria-controls="certificate-album-container"
          aria-label="Oracle Certification Booster Pack. Click to unwrap and view certificate album."
        >
          {/* Shimmer sweep every 4s */}
          <div className="pack-shimmer-sweep" />

          {/* Crimped Zig-Zag Top Edge: violet-to-lavender gradient */}
          <div ref={tearTopRef} className="crimp-edge-top" />

          {/* Top Header: ORACLE CERTIFICATION PACK & verified! sticker */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", position: "relative", zIndex: 10 }}>
            <span className="pack-label-badge">
              ORACLE CERTIFICATION PACK
            </span>
            <div className="pack-verified-sticker">
              <span style={{ color: "#00f0ff" }}>✦</span>
              <span>verified!</span>
            </div>
          </div>

          {/* Center Huge Numeral in Bricolage & Subtext */}
          <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
            <div
              className="pack-big-num"
              onClick={handleNumClick}
              title="Click me for a surprise!"
            >
              25<span style={{ color: "var(--vault-lavender)" }}>+</span>
            </div>
            <p className="pack-subtitle-text">
              Cloud · Generative AI · DevOps · Networking · Data Science
            </p>
            <div style={{ marginTop: "10px" }}>
              <span className="pack-authentic-badge">100% AUTHENTIC BADGES</span>
            </div>
          </div>

          {/* Bottom Note: "tap to unwrap ->" with looping hand-drawn note in lavender */}
          <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
            <div className="pack-handwritten-note">
              <span>tap to unwrap</span>
              <svg width="34" height="20" viewBox="0 0 34 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2 12C9 4 18 2 24 7C28 10 27 16 22 17C17 18 16 12 21 9C24 7 28 8 32 10M32 10L26 8M32 10L29 15"
                  stroke="#c4b5fd"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Crimped Zig-Zag Bottom Edge: violet-to-lavender gradient */}
          <div className="crimp-edge-bottom" />
        </button>
      </div>

      {/* Easter Egg Toast on 5 Clicks */}
      {easterEggToast && (
        <div className="badge-toast-popup">
          <span>✨</span>
          <span>okay okay, you're keen!</span>
          <span>🎉</span>
        </div>
      )}
    </div>
  );
};

export default BoosterPack;
