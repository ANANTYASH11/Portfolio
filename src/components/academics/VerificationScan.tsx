import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiCheck } from "react-icons/fi";
import { VERIFICATION_HOTSPOTS, VerificationHotspot } from "./certificateFacts";
import { ACADEMICS_CONFIG } from "./academicsConfig";

gsap.registerPlugin(ScrollTrigger);

interface VerificationScanProps {
  containerRef: React.RefObject<HTMLDivElement>;
  onVerificationComplete?: () => void;
}

export const VerificationScan: React.FC<VerificationScanProps> = ({
  containerRef,
  onVerificationComplete,
}) => {
  const scanLineRef = useRef<HTMLDivElement>(null);
  const [activeHotspots, setActiveHotspots] = useState<Set<string>>(new Set());
  const [focusedHotspot, setFocusedHotspot] = useState<string | null>(null);
  const [isScanComplete, setIsScanComplete] = useState<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    const scanLine = scanLineRef.current;
    if (!container || !scanLine) return;

    const isReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Reduced motion fallback: show all hotspots statically without scan
    if (isReducedMotion) {
      setActiveHotspots(new Set(VERIFICATION_HOTSPOTS.map((h) => h.id)));
      setIsScanComplete(true);
      onVerificationComplete?.();
      return;
    }

    const ctx = gsap.context(() => {
      // Trigger scan when certificate scrolls into view
      ScrollTrigger.create({
        trigger: container,
        start: "top 75%",
        once: true,
        onEnter: () => {
          const scanObj = { progress: 0 };

          gsap.to(scanObj, {
            progress: 1,
            duration: ACADEMICS_CONFIG.scanDuration || 1.6,
            ease: "power2.inOut",
            onUpdate: () => {
              if (scanLine) {
                scanLine.style.top = `${scanObj.progress * 100}%`;
                scanLine.style.opacity = scanObj.progress > 0.96 ? `${(1 - scanObj.progress) * 25}` : "1";
              }

              // Check and activate each hotspot as scan line passes it
              VERIFICATION_HOTSPOTS.forEach((spot) => {
                if (scanObj.progress >= spot.triggerPct) {
                  setActiveHotspots((prev) => {
                    if (prev.has(spot.id)) return prev;
                    const next = new Set(prev);
                    next.add(spot.id);
                    return next;
                  });
                }
              });
            },
            onComplete: () => {
              setIsScanComplete(true);
              if (scanLine) {
                scanLine.style.opacity = "0";
              }
              onVerificationComplete?.();
            },
          });
        },
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, [containerRef, onVerificationComplete]);

  return (
    <div
      className="cert-verification-scan-layer"
      aria-hidden="false"
      data-scan-complete={isScanComplete}
    >
      {/* ─── Travelling Lavender Scan Line ─── */}
      <div
        ref={scanLineRef}
        className="cert-scan-laser-line"
        style={{ opacity: 0 }}
        aria-hidden="true"
      >
        <div className="laser-beam-glow" />
        <div className="laser-beam-core" />
      </div>

      {/* ─── 4 Quiet Cyan Check Dot Hotspots ─── */}
      <div className="cert-hotspots-overlay">
        {VERIFICATION_HOTSPOTS.map((spot: VerificationHotspot) => {
          const isActivated = activeHotspots.has(spot.id);
          const isHovered = focusedHotspot === spot.id;

          return (
            <div
              key={spot.id}
              className={`cert-hotspot-wrapper ${
                isActivated ? "hotspot-active" : "hotspot-idle"
              }`}
              style={{
                top: spot.certPosition.top,
                left: spot.certPosition.left,
              }}
            >
              {/* Accessible Interactive Hotspot Button */}
              <button
                type="button"
                className={`cert-hotspot-dot ${isHovered ? "dot-hovered" : ""}`}
                aria-label={spot.ariaLabel}
                aria-describedby={`tooltip-${spot.id}`}
                onMouseEnter={() => setFocusedHotspot(spot.id)}
                onMouseLeave={() => setFocusedHotspot(null)}
                onFocus={() => setFocusedHotspot(spot.id)}
                onBlur={() => setFocusedHotspot(null)}
                onClick={(e) => {
                  e.stopPropagation(); // Avoid triggering lightbox on hotspot click
                  setFocusedHotspot((prev) => (prev === spot.id ? null : spot.id));
                }}
              >
                <span className="dot-ripple-ring" aria-hidden="true" />
                <span className="dot-center-circle" aria-hidden="true">
                  <FiCheck className="dot-check-icon" aria-hidden="true" />
                </span>
              </button>

              {/* Glass Micro-Tooltip */}
              <div
                id={`tooltip-${spot.id}`}
                role="tooltip"
                className={`cert-hotspot-glass-tooltip ${
                  isHovered ? "tooltip-visible" : "tooltip-hidden"
                }`}
                aria-hidden={!isHovered}
              >
                <div className="tooltip-eyebrow">
                  <span className="tooltip-cyan-dot" />
                  <span>{spot.label}</span>
                </div>
                <div className="tooltip-title">{spot.tooltipTitle}</div>
                <div className="tooltip-body">{spot.tooltipText}</div>
                {spot.factCode && (
                  <code className="tooltip-code">{spot.factCode}</code>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Visually Hidden Semantic List for Screen Readers */}
      <ul className="sr-only">
        {VERIFICATION_HOTSPOTS.map((spot) => (
          <li key={spot.id}>
            {spot.tooltipTitle}: {spot.tooltipText}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VerificationScan;
