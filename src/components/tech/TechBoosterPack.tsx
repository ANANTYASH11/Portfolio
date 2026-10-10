import React, { useRef, useCallback, useEffect } from "react";
import gsap from "gsap";
import { collectionAudio } from "../certificates/audio";
import { COLLECTION_CONFIG } from "../certificates/certificates";

interface TechBoosterPackProps {
  onUnwrap: () => void;
  isUnwrapping: boolean;
  onEasterEggConfetti?: () => void;
}

const TechBoosterPack: React.FC<TechBoosterPackProps> = ({
  onUnwrap,
  isUnwrapping,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);
  const lightSpillRef = useRef<HTMLDivElement>(null);
  const teaserLeftRef = useRef<HTMLDivElement>(null);
  const teaserRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isUnwrapping) return;

    collectionAudio.playDing();

    if (seamRef.current && lightSpillRef.current) {
      gsap.to(seamRef.current, {
        opacity: 1,
        boxShadow: "0 0 30px rgba(196, 181, 253, 1), 0 0 60px rgba(139, 92, 246, 0.8)",
        duration: 0.25,
        ease: "power2.out",
      });

      gsap.to(lightSpillRef.current, {
        opacity: 0.9,
        scaleX: 2.5,
        duration: COLLECTION_CONFIG.vaultDoor.lightSpillDuration,
        ease: "power2.out",
      });
    }

    if (leftDoorRef.current && rightDoorRef.current) {
      gsap.to(leftDoorRef.current, {
        xPercent: -COLLECTION_CONFIG.vaultDoor.splitDistancePercent,
        opacity: 0,
        duration: COLLECTION_CONFIG.vaultDoor.splitDuration,
        ease: COLLECTION_CONFIG.vaultDoor.splitEase,
      });

      gsap.to(rightDoorRef.current, {
        xPercent: COLLECTION_CONFIG.vaultDoor.splitDistancePercent,
        opacity: 0,
        duration: COLLECTION_CONFIG.vaultDoor.splitDuration,
        ease: COLLECTION_CONFIG.vaultDoor.splitEase,
      });
    }

    if (teaserLeftRef.current && teaserRightRef.current) {
      gsap.to([teaserLeftRef.current, teaserRightRef.current], {
        opacity: 0,
        y: -30,
        duration: 0.4,
        ease: "power2.in",
      });
    }
  }, [isUnwrapping]);

  const handleMouseEnter = useCallback(() => {
    if (isUnwrapping || !containerRef.current) return;
    collectionAudio.playPop();

    gsap.to(containerRef.current, {
      y: -6,
      rotate: (Math.random() > 0.5 ? 1 : -1) * 1.5,
      duration: 0.35,
      ease: "power2.out",
    });

    if (teaserLeftRef.current && teaserRightRef.current) {
      gsap.to(teaserLeftRef.current, {
        y: -16,
        rotate: -5,
        duration: 0.35,
        ease: "power2.out",
      });
      gsap.to(teaserRightRef.current, {
        y: -16,
        rotate: 5,
        duration: 0.35,
        ease: "power2.out",
      });
    }
  }, [isUnwrapping]);

  const handleMouseLeave = useCallback(() => {
    if (isUnwrapping || !containerRef.current) return;
    gsap.to(containerRef.current, {
      y: 0,
      rotate: 0,
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });

    if (teaserLeftRef.current && teaserRightRef.current) {
      gsap.to([teaserLeftRef.current, teaserRightRef.current], {
        y: 0,
        rotate: (i) => (i === 0 ? -3 : 3),
        duration: 0.28,
        ease: "power2.inOut",
      });
    }
  }, [isUnwrapping]);

  return (
    <div className="booster-stage-wrap">
      <div className="booster-pack-anchor pack-idle-float">
        {/* Teaser Peek Cards Behind */}
        <div
          ref={teaserLeftRef}
          className="teaser-peek-card teaser-peek-left"
          aria-hidden="true"
        >
          <span
            style={{
              fontFamily: "var(--vault-font-label)",
              fontSize: "9px",
              color: "var(--vault-accent-lavender)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 600,
            }}
          >
            PRIMARY
          </span>
          <div
            style={{
              fontFamily: "var(--vault-font-body)",
              color: "var(--vault-text-title)",
              fontSize: "13px",
              fontWeight: 600,
              marginTop: "4px",
            }}
          >
            TypeScript
          </div>
        </div>

        <div
          ref={teaserRightRef}
          className="teaser-peek-card teaser-peek-right"
          aria-hidden="true"
        >
          <span
            style={{
              fontFamily: "var(--vault-font-label)",
              fontSize: "9px",
              color: "var(--vault-accent-lavender)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 600,
            }}
          >
            FRONTEND
          </span>
          <div
            style={{
              fontFamily: "var(--vault-font-body)",
              color: "var(--vault-text-title)",
              fontSize: "13px",
              fontWeight: 600,
              marginTop: "4px",
            }}
          >
            React · Next
          </div>
        </div>

        {/* Central Lavender Light Spill */}
        <div
          ref={lightSpillRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "10%",
            bottom: "10%",
            width: "60px",
            transform: "translateX(-50%)",
            background: "radial-gradient(ellipse at center, rgba(196, 181, 253, 0.8) 0%, rgba(139, 92, 246, 0.4) 40%, transparent 70%)",
            filter: "blur(18px)",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 4,
          }}
        />

        {/* Vault Door Container */}
        <div
          ref={containerRef}
          onClick={onUnwrap}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="vault-door-outer-wrap"
          style={{
            position: "relative",
            width: "360px",
            maxWidth: "calc(100vw - 32px)",
            minHeight: "500px",
            cursor: "pointer",
            userSelect: "none",
            zIndex: 10,
          }}
          role="button"
          tabIndex={0}
          aria-expanded={false}
          aria-label="Open Tech Collection Vault"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onUnwrap();
          }}
        >
          {/* Left Door Half */}
          <div
            ref={leftDoorRef}
            className="vault-door-panel vault-door-panel-left"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "50%",
              overflow: "hidden",
              borderTopLeftRadius: "var(--vault-radius-lg)",
              borderBottomLeftRadius: "var(--vault-radius-lg)",
              backgroundColor: "var(--vault-card-bg)",
              backgroundImage: "radial-gradient(ellipse at 100% 0%, rgba(139, 92, 246, 0.14) 0%, transparent 65%)",
              border: "var(--vault-border-default)",
              borderRight: "none",
              boxShadow: "var(--vault-shadow-card)",
              zIndex: 10,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "360px",
                height: "100%",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                textAlign: "left",
                pointerEvents: "none",
              }}
            >
              <div className="pack-tear-top-section">
                <div className="tear-dots-row">
                  <span className="tear-dot" />
                  <span className="tear-dot" />
                </div>
                <span className="tear-edition-pill">
                  PRODUCTION STACK
                </span>
              </div>

              <div className="pack-center-content">
                <span className="pack-title-pill">
                  FULL-STACK &amp; AI ARCHITECTURE
                </span>
                <div className="pack-huge-num-wrap">
                  <h2 className="pack-huge-num">
                    41<span className="plus-char">+</span>
                  </h2>
                </div>
                <p className="pack-sub-domains">
                  Languages · Frontend · Backend · Databases · Systems · AI
                </p>
                <div className="pack-seal-badge">
                  <span>✦</span>
                  <span>PRODUCTION TESTED NODES</span>
                  <span>✦</span>
                </div>
              </div>

              <div className="pack-bottom-cta">
                <div className="pack-unwrap-hint">
                  <span>Tap to open vault</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
                <span className="pack-series-tag">SERIES 2025</span>
              </div>
            </div>
          </div>

          {/* Right Door Half */}
          <div
            ref={rightDoorRef}
            className="vault-door-panel vault-door-panel-right"
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: "50%",
              overflow: "hidden",
              borderTopRightRadius: "var(--vault-radius-lg)",
              borderBottomRightRadius: "var(--vault-radius-lg)",
              backgroundColor: "var(--vault-card-bg)",
              backgroundImage: "radial-gradient(ellipse at 0% 0%, rgba(139, 92, 246, 0.14) 0%, transparent 65%)",
              border: "var(--vault-border-default)",
              borderLeft: "none",
              boxShadow: "var(--vault-shadow-card)",
              zIndex: 10,
            }}
          >
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                width: "360px",
                height: "100%",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                textAlign: "left",
                pointerEvents: "none",
              }}
            >
              <div className="pack-tear-top-section">
                <div className="tear-dots-row">
                  <span className="tear-dot" />
                  <span className="tear-dot" />
                </div>
                <span className="tear-edition-pill">
                  PRODUCTION STACK
                </span>
              </div>

              <div className="pack-center-content">
                <span className="pack-title-pill">
                  FULL-STACK &amp; AI ARCHITECTURE
                </span>
                <div className="pack-huge-num-wrap">
                  <h2 className="pack-huge-num">
                    41<span className="plus-char">+</span>
                  </h2>
                </div>
                <p className="pack-sub-domains">
                  Languages · Frontend · Backend · Databases · Systems · AI
                </p>
                <div className="pack-seal-badge">
                  <span>✦</span>
                  <span>PRODUCTION TESTED NODES</span>
                  <span>✦</span>
                </div>
              </div>

              <div className="pack-bottom-cta">
                <div className="pack-unwrap-hint">
                  <span>Tap to open vault</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
                <span className="pack-series-tag">SERIES 2025</span>
              </div>
            </div>
          </div>

          {/* Central Pulsating Seam */}
          <div
            ref={seamRef}
            className="vault-door-seam"
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: "1.5px",
              transform: "translateX(-50%)",
              background: "linear-gradient(180deg, transparent 0%, rgba(196, 181, 253, 0.8) 50%, transparent 100%)",
              boxShadow: "0 0 8px rgba(139, 92, 246, 0.5)",
              animation: "seamPulse 3s ease-in-out infinite",
              zIndex: 15,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TechBoosterPack;
