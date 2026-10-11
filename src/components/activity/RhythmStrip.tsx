import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GithubWeek } from "./useActivity";

gsap.registerPlugin(ScrollTrigger);

export interface RhythmStripProps {
  weeks: GithubWeek[];
  calendar?: Record<string, number>;
}

interface WeekActivity {
  weekIndex: number;
  startDateStr: string;
  formattedLabel: string;
  ghCount: number;
  lcCount: number;
  total: number;
  isBest: boolean;
}

export const RhythmStrip: React.FC<RhythmStripProps> = ({
  weeks = [],
  calendar = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const barsGroupRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
    visible: boolean;
  }>({ text: "", x: 0, y: 0, visible: false });

  // Map LeetCode calendar timestamps -> YYYY-MM-DD
  const lcCountByDate = useMemo(() => {
    const map: Record<string, number> = {};
    Object.entries(calendar || {}).forEach(([tsStr, count]) => {
      const ts = Number(tsStr);
      if (!isNaN(ts)) {
        const d = new Date(ts > 1e11 ? ts : ts * 1000);
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth() + 1).padStart(2, "0");
        const day = String(d.getUTCDate()).padStart(2, "0");
        map[`${y}-${m}-${day}`] = (map[`${y}-${m}-${day}`] || 0) + count;
      }
    });
    return map;
  }, [calendar]);

  // Format date helper: "2026-03-03" -> "3 Mar"
  const formatWeekLabel = useCallback((dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split("-").map(Number);
      const d = new Date(year, month - 1, day);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${d.getDate()} ${months[d.getMonth()]}`;
    } catch {
      return dateStr;
    }
  }, []);

  // Compute 52 weeks of stacked activity
  const { weekData, maxTotal, overallTotal } = useMemo(() => {
    // Take the last 52 weeks
    const sliced = weeks.slice(-52);
    let max = 1;
    let bestIdx = 0;
    let sum = 0;

    const data: WeekActivity[] = sliced.map((w, idx) => {
      const gh = w.contributionDays?.reduce((acc, d) => acc + (d.contributionCount || 0), 0) || 0;
      const lc = w.contributionDays?.reduce((acc, d) => acc + (lcCountByDate[d.date] || 0), 0) || 0;
      const tot = gh + lc;
      sum += tot;

      const firstDate = w.contributionDays?.[0]?.date || "";
      const label = firstDate ? formatWeekLabel(firstDate) : `W${idx + 1}`;

      if (tot > max) {
        max = tot;
        bestIdx = idx;
      }

      return {
        weekIndex: idx,
        startDateStr: firstDate,
        formattedLabel: label,
        ghCount: gh,
        lcCount: lc,
        total: tot,
        isBest: false,
      };
    });

    if (data[bestIdx]) {
      data[bestIdx].isBest = true;
    }

    return { weekData: data, maxTotal: max, bestIndex: bestIdx, overallTotal: sum };
  }, [weeks, lcCountByDate, formatWeekLabel]);

  // Entrance animation: bars rise with 0.01s stagger ("power3.out") once on enter
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !barsGroupRef.current) return;

    const el = barsGroupRef.current;
    const ctx = gsap.context(() => {
      const bars = el.querySelectorAll(".proof-rhythm-bar-stack");
      if (!bars || bars.length === 0) return;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            bars,
            { scaleY: 0, transformOrigin: "bottom center" },
            {
              scaleY: 1,
              duration: 0.65,
              ease: "power3.out",
              stagger: 0.01,
            }
          );
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [weekData]);

  // Mobile: scroll to end on mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    }
  }, [weekData]);

  const handleBarMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    item: WeekActivity
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const text = `Week of ${item.formattedLabel}: ${item.ghCount} commits, ${item.lcCount} solves`;
    setTooltip({
      text,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
      visible: true,
    });
  };

  const handleBarMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  const heightMax = 56; // 56px tall sparkline

  return (
    <div
      ref={containerRef}
      className="proof-rhythm-wrapper"
      role="region"
      aria-label={`Rhythm strip sparkline showing 52 weeks of combined activity totaling ${overallTotal} contributions and solves`}
    >
      <div className="proof-rhythm-header">
        <span className="proof-rhythm-caption">Weekly activity, GitHub + LeetCode</span>
        <div className="proof-rhythm-legend" aria-hidden="true">
          <span className="rhythm-legend-item">
            <span className="rhythm-legend-dot gh-dot" />
            <span>GitHub</span>
          </span>
          <span className="rhythm-legend-item">
            <span className="rhythm-legend-dot lc-dot" />
            <span>LeetCode</span>
          </span>
        </div>
      </div>

      <div className="proof-rhythm-scroll" ref={scrollRef}>
        <div className="proof-rhythm-strip" ref={barsGroupRef}>
          {weekData.map((item, idx) => {
            const totalRatio = maxTotal > 0 ? item.total / maxTotal : 0;
            const barHeight = Math.max(item.total > 0 ? 4 : 2, Math.round(totalRatio * heightMax));

            const ghHeight = item.total > 0 ? Math.round((item.ghCount / item.total) * barHeight) : 0;
            const lcHeight = barHeight - ghHeight;

            return (
              <div
                key={`rhythm-${idx}`}
                className={`proof-rhythm-col ${item.isBest ? "is-best-week" : ""}`}
                onMouseEnter={(e) => handleBarMouseEnter(e, item)}
                onMouseLeave={handleBarMouseLeave}
                tabIndex={0}
                role="img"
                aria-label={`Week of ${item.formattedLabel}: ${item.ghCount} GitHub commits, ${item.lcCount} LeetCode solves${item.isBest ? ", Best week" : ""}`}
              >
                {item.isBest && (
                  <span className="proof-rhythm-best-badge" aria-hidden="true">
                    Best week
                  </span>
                )}
                <div
                  className="proof-rhythm-bar-stack"
                  style={{ height: `${barHeight}px` }}
                >
                  {lcHeight > 0 && (
                    <div
                      className="proof-rhythm-seg-lc"
                      style={{ height: `${lcHeight}px` }}
                    />
                  )}
                  {ghHeight > 0 && (
                    <div
                      className="proof-rhythm-seg-gh"
                      style={{ height: `${ghHeight}px` }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {tooltip.visible && (
        <div
          className="proof-tooltip"
          role="tooltip"
          style={{
            position: "fixed",
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: "translate(-50%, -100%)",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

export default RhythmStrip;
