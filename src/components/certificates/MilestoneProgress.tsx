import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { COLLECTION_CONFIG } from "./certificates";

interface MilestoneProgressProps {
  currentCount?: number;
  totalGoal?: string;
}

export const MilestoneProgress: React.FC<MilestoneProgressProps> = ({
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
          // Check ticks along the way and trigger ring pulse
          const progress = this.progress();
          const currentPct = progress * fillPercentage;

          COLLECTION_CONFIG.milestones.forEach((m) => {
            if (currentPct >= m.pct) {
              const tickEl = document.querySelector(`[data-tick-id="${m.id}"]`);
              if (tickEl && !tickEl.classList.contains("has-pulsed")) {
                tickEl.classList.add("has-pulsed");
                gsap.fromTo(
                  tickEl,
                  { scale: 1.4, boxShadow: "0 0 14px rgba(196, 181, 253, 0.8)" },
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
    <div className="milestone-track-wrap" style={{ position: "relative", width: "100%" }}>
      {/* Header labels */}
      <div className="album-xp-labels" style={{ marginBottom: "14px" }}>
        <span className="album-xp-label-main">
          <span>CREDENTIALS COLLECTED</span>
          <span>·</span>
          <span style={{ color: "var(--vault-text-title)" }}>{currentCount} / {totalGoal}</span>
        </span>
        <span className="album-xp-label-level">
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
          margin: "8px 0 24px 0",
        }}
      >
        {/* Dashed background segment for unreached portion */}
        <div
          style={{
            position: "absolute",
            left: `${fillPercentage}%`,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundImage: "linear-gradient(90deg, rgba(255, 255, 255, 0.25) 50%, transparent 50%)",
            backgroundSize: "6px 100%",
            opacity: 0.6,
          }}
        />

        {/* Animated Fill Bar */}
        <div
          ref={fillBarRef}
          className="album-xp-fill-bar"
          style={{
            height: "100%",
            borderRadius: "100px",
            background: "var(--vault-gradient-primary)",
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
              boxShadow: "0 0 10px rgba(139, 92, 246, 0.6)",
            }}
          />
        </div>

        {/* 4 Milestone Ticks */}
        {COLLECTION_CONFIG.milestones.map((m) => {
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
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: isReached ? "var(--vault-accent-lavender)" : "#16121f",
                border: isReached
                  ? "2px solid #0b0912"
                  : "1.5px solid rgba(255, 255, 255, 0.25)",
                cursor: "pointer",
                zIndex: 10,
                transition: "transform 0.2s ease, background-color 0.3s ease",
              }}
              onMouseEnter={() => setActiveTooltip(m.id)}
              onMouseLeave={() => setActiveTooltip(null)}
              onClick={() => setActiveTooltip((prev) => (prev === m.id ? null : m.id))}
            >
              {/* Tick Label Below */}
              <span
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily: "var(--vault-font-label)",
                  fontSize: "10px",
                  fontWeight: 600,
                  color: isReached ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.35)",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {m.label}
              </span>

              {/* Hover Tooltip */}
              {isTooltipOpen && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "22px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#161220",
                    border: "1px solid rgba(196, 181, 253, 0.3)",
                    borderRadius: "10px",
                    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.6)",
                    padding: "8px 12px",
                    minWidth: "180px",
                    zIndex: 50,
                    pointerEvents: "none",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--vault-font-label)",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "var(--vault-accent-lavender)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    {m.label} ({m.count} / 25)
                  </div>
                  <ul
                    style={{
                      margin: 0,
                      padding: 0,
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    {m.certs.map((c, i) => (
                      <li
                        key={i}
                        style={{
                          fontFamily: "var(--vault-font-body)",
                          fontSize: "11px",
                          color: "rgba(255, 255, 255, 0.75)",
                          lineHeight: 1.3,
                        }}
                      >
                        • {c}
                      </li>
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

export default MilestoneProgress;
