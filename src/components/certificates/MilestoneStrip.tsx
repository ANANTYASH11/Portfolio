import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { VAULT_CONFIG } from "./certificates";

interface MilestoneStripProps {
  currentCount?: number;
  totalGoal?: string;
}

export const MilestoneStrip: React.FC<MilestoneStripProps> = ({
  currentCount = 18,
  totalGoal = "25+",
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const fillBarRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const fillPercentage = 72; // 18 / 25

  useEffect(() => {
    if (!fillBarRef.current) return;

    gsap.fromTo(
      fillBarRef.current,
      { width: "0%" },
      {
        width: `${fillPercentage}%`,
        duration: 1.1,
        ease: "power3.out",
        onUpdate: function () {
          const progress = this.progress();
          const currentPct = progress * fillPercentage;

          (VAULT_CONFIG.milestones || []).forEach((m) => {
            if (currentPct >= m.pct) {
              const tickEl = document.querySelector(`[data-tick-id="${m.id}"]`);
              if (tickEl && !tickEl.classList.contains("has-pulsed")) {
                tickEl.classList.add("has-pulsed");
                gsap.fromTo(
                  tickEl,
                  { scale: 1.4, boxShadow: "0 0 12px rgba(196, 181, 253, 0.85)" },
                  { scale: 1, boxShadow: "0 0 0px transparent", duration: 0.6, ease: "power2.out" }
                );
              }
            }
          });
        },
      }
    );
  }, [fillPercentage]);

  return (
    <div className="milestone-track-wrap" style={{ position: "relative", width: "100%", margin: "8px 0 24px 0" }}>
      {/* Header labels */}
      <div className="album-xp-labels" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <span className="album-xp-label-main" style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--vault-text-label)", fontFamily: "Space Grotesk, sans-serif" }}>
          <span>CREDENTIALS COLLECTED</span>
          <span style={{ margin: "0 6px" }}>·</span>
          <strong style={{ color: "var(--vault-text-title)", fontWeight: 600 }}>{currentCount} / {totalGoal}</strong>
        </span>
        <span className="album-xp-label-level" style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--vault-accent-lavender)", fontFamily: "Space Grotesk, sans-serif", fontWeight: 600 }}>
          ORACLE CERTIFIED
        </span>
      </div>

      {/* 4px Progress Track Container */}
      <div
        ref={trackRef}
        className="milestone-outer-bar"
        style={{
          position: "relative",
          width: "100%",
          height: "4px",
          borderRadius: "100px",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Animated Fill Bar with Lavender Gradient */}
        <div
          ref={fillBarRef}
          className="album-xp-fill-bar"
          style={{
            height: "100%",
            borderRadius: "100px",
            background: "linear-gradient(90deg, #8b5cf6 0%, #c4b5fd 100%)",
            position: "relative",
            width: `${fillPercentage}%`,
          }}
        >
          {/* Lavender Tip Dot */}
          <span
            className="album-xp-dot-tip"
            style={{
              position: "absolute",
              right: "-4px",
              top: "-3px",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "var(--vault-accent-lavender)",
              boxShadow: "0 0 10px rgba(139, 92, 246, 0.8)",
            }}
          />
        </div>

        {/* 4 Milestone Ticks */}
        {(VAULT_CONFIG.milestones || []).map((m) => {
          const isReached = m.isReached;
          const isTooltipOpen = activeTooltip === m.id;

          return (
            <div
              key={m.id}
              data-tick-id={m.id}
              className={`milestone-tick ${isReached ? "is-reached" : ""}`}
              style={{
                position: "absolute",
                left: `${m.pct}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: isReached ? "var(--vault-accent-lavender)" : "#16121f",
                border: `1px solid ${isReached ? "#8b5cf6" : "rgba(255, 255, 255, 0.16)"}`,
                cursor: "pointer",
                zIndex: 4,
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={() => setActiveTooltip(m.id)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              {/* Tick Label Below */}
              <span
                style={{
                  position: "absolute",
                  top: "14px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "10px",
                  fontFamily: "Space Grotesk, sans-serif",
                  letterSpacing: "0.08em",
                  whiteSpace: "nowrap",
                  color: isReached ? "rgba(255, 255, 255, 0.65)" : "rgba(255, 255, 255, 0.35)",
                }}
              >
                {m.label}
              </span>

              {/* Tooltip Listing Those Certificates */}
              {isTooltipOpen && (
                <div
                  className="milestone-tooltip"
                  style={{
                    position: "absolute",
                    bottom: "22px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#110e1a",
                    border: "1px solid rgba(196, 181, 253, 0.35)",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    minWidth: "190px",
                    zIndex: 30,
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.8)",
                    pointerEvents: "none",
                  }}
                >
                  <div style={{ color: "#c4b5fd", fontSize: "11px", fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, marginBottom: "4px" }}>
                    {m.label} ({m.count})
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "14px", color: "rgba(255, 255, 255, 0.75)", fontSize: "10px", lineHeight: 1.45 }}>
                    {m.certs.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MilestoneStrip;
