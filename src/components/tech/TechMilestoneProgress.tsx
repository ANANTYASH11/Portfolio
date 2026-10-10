import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export const TechMilestoneProgress: React.FC = () => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const fillBarRef = useRef<HTMLDivElement>(null);

  const milestones = [
    { id: "core_lang", count: 8, label: "8 Languages", pct: 20, isReached: true, certs: ["TypeScript", "JavaScript", "Python", "C++", "C", "Java", "HTML5", "CSS3"] },
    { id: "frontend_eng", count: 14, label: "14 Full-Stack", pct: 35, isReached: true, certs: ["React.js", "Next.js", "Three.js", "GSAP", "Tailwind", "Redux"] },
    { id: "all_mastered", count: 41, label: "41 Mastered", pct: 100, isReached: true, certs: ["All 41 Systems, AI Pipelines, Cloud, Databases & Networking Nodes"] },
  ];

  useEffect(() => {
    if (!fillBarRef.current) return;

    gsap.fromTo(
      fillBarRef.current,
      { width: "0%" },
      {
        width: "100%",
        duration: 1.1,
        ease: "power3.out",
      }
    );
  }, []);

  return (
    <div className="milestone-track-wrap" style={{ position: "relative", width: "100%" }}>
      <div className="album-xp-labels" style={{ marginBottom: "14px" }}>
        <span className="album-xp-label-main">
          <span>NODES MASTERED</span>
          <span>·</span>
          <span style={{ color: "var(--vault-text-title)" }}>41 / 41</span>
        </span>
        <span className="album-xp-label-level">
          FULL-STACK ARCHITECT
        </span>
      </div>

      <div
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
        <div
          ref={fillBarRef}
          className="album-xp-fill-bar"
          style={{
            height: "100%",
            borderRadius: "100px",
            background: "var(--vault-gradient-primary)",
            position: "relative",
            width: "100%",
          }}
        >
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

        {milestones.map((m) => {
          const isTooltipOpen = activeTooltip === m.id;

          return (
            <div
              key={m.id}
              data-tick-id={m.id}
              className="milestone-tick is-reached"
              style={{
                position: "absolute",
                left: `${m.pct}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "var(--vault-accent-lavender)",
                border: "2px solid #0b0912",
                cursor: "pointer",
                zIndex: 10,
              }}
              onMouseEnter={() => setActiveTooltip(m.id)}
              onMouseLeave={() => setActiveTooltip(null)}
              onClick={() => setActiveTooltip((prev) => (prev === m.id ? null : m.id))}
            >
              <span
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily: "var(--vault-font-label)",
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "rgba(255, 255, 255, 0.7)",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {m.label}
              </span>

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
                    {m.label} ({m.count} Nodes)
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

export default TechMilestoneProgress;
