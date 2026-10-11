import React, { useState, useRef, useEffect, useCallback, useId, useMemo } from "react";
import gsap from "gsap";
import { GithubWeek } from "./useActivity";

export interface HeatmapProps {
  weeks: GithubWeek[];
  unitName?: string; // "contributions" | "submissions"
  idPrefix?: string;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const Heatmap: React.FC<HeatmapProps> = ({
  weeks,
  unitName = "contributions",
  idPrefix = "proof",
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const [focusedCoord, setFocusedCoord] = useState<{ week: number; day: number } | null>(null);
  const [hasLeftOverflow, setHasLeftOverflow] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<{
    text: string;
    x: number;
    y: number;
    visible: boolean;
  }>({ text: "", x: 0, y: 0, visible: false });

  const tooltipId = useId();
  const fullTooltipId = `${idPrefix}-tooltip-${tooltipId}`;

  // Scroll to latest weeks on mount and whenever size updates
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollToRight = () => {
      if (el && el.scrollWidth > el.clientWidth) {
        el.scrollLeft = el.scrollWidth - el.clientWidth;
        setHasLeftOverflow(el.scrollLeft > 10);
      }
    };

    scrollToRight();
    const rafId = requestAnimationFrame(scrollToRight);
    const t1 = setTimeout(scrollToRight, 80);
    const t2 = setTimeout(scrollToRight, 300);

    const ro = new ResizeObserver(() => {
      scrollToRight();
    });
    ro.observe(el);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
      ro.disconnect();
    };
  }, [weeks]);

  // Handle scroll to toggle left-edge fade
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setHasLeftOverflow(e.currentTarget.scrollLeft > 10);
  };

  // Format date helper: "YYYY-MM-DD" -> "4 Mar 2026"
  const formatDate = useCallback((dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      const dayNum = date.getDate();
      const monthStr = MONTH_NAMES[date.getMonth()];
      const yearNum = date.getFullYear();
      return `${dayNum} ${monthStr} ${yearNum}`;
    } catch {
      return dateStr;
    }
  }, []);

  // Intensity levels: 0 (white 5% with 1px border) to 4 (lavender #c4b5fd)
  const getLevel = useCallback((count: number): number => {
    if (count <= 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 8) return 3;
    return 4;
  }, []);

  // Compute each month label's column from the first week column where that month begins
  const monthLabels = useMemo(() => {
    const labels: { text: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, wIdx) => {
      // Find the first day with a valid date
      const day = week.contributionDays?.find((d) => Boolean(d.date));
      if (day?.date) {
        const parts = day.date.split("-");
        const month = parseInt(parts[1], 10) - 1;
        if (month !== lastMonth) {
          labels.push({ text: MONTH_NAMES[month], weekIndex: wIdx });
          lastMonth = month;
        }
      }
    });

    return labels;
  }, [weeks]);

  // Diagonal ripple entrance animation (0.004s per cell, power2.out)
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !gridRef.current) return;

    const ctx = gsap.context(() => {
      const cells = gridRef.current?.querySelectorAll(".proof-cell");
      if (!cells || cells.length === 0) return;

      gsap.fromTo(
        cells,
        { opacity: 0, scale: 0.3 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          stagger: (index) => {
            const weekIdx = Math.floor(index / 7);
            const dayIdx = index % 7;
            return (weekIdx + dayIdx) * 0.004;
          },
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, [weeks]);

  // Show floating tooltip
  const showTooltipForCell = (
    targetEl: HTMLElement,
    count: number,
    dateStr: string,
    wIdx: number
  ) => {
    setHoveredWeek(wIdx);
    const rect = targetEl.getBoundingClientRect();
    const formatted = formatDate(dateStr);
    const text = `${count} ${
      unitName === "contributions"
        ? count === 1
          ? "contribution"
          : "contributions"
        : count === 1
        ? "submission"
        : "submissions"
    } on ${formatted}`;

    setActiveTooltip({
      text,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
      visible: true,
    });
  };

  const handleCellMouseLeave = () => {
    setHoveredWeek(null);
    setActiveTooltip((prev) => ({ ...prev, visible: false }));
  };

  // Keyboard navigation for roving tabindex
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    wIdx: number,
    dIdx: number
  ) => {
    let nextWeek = wIdx;
    let nextDay = dIdx;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      nextDay = Math.max(0, dIdx - 1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      nextDay = Math.min(6, dIdx + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      nextWeek = Math.max(0, wIdx - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextWeek = Math.min(weeks.length - 1, wIdx + 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const day = weeks[wIdx]?.contributionDays?.[dIdx];
      if (day) {
        showTooltipForCell(e.currentTarget, day.contributionCount, day.date, wIdx);
      }
      return;
    } else {
      return;
    }

    setFocusedCoord({ week: nextWeek, day: nextDay });
    const targetCell = gridRef.current?.querySelector(
      `[data-coord="${nextWeek}-${nextDay}"]`
    ) as HTMLElement | null;
    targetCell?.focus();
  };

  const totalCount = useMemo(() => {
    return weeks.reduce(
      (acc, w) =>
        acc +
        (w.contributionDays?.reduce((wAcc, d) => wAcc + (d.contributionCount || 0), 0) || 0),
      0
    );
  }, [weeks]);

  return (
    <div className="proof-heatmap-wrapper">
      <div className="proof-heatmap-viewport-wrap">
        {/* Left-edge fade mask only shown while scrolled */}
        <div
          className={`proof-heatmap-fade-left ${hasLeftOverflow ? "is-visible" : ""}`}
          aria-hidden="true"
        />

        {/* Scrollable Container */}
        <div
          className="proof-heatmap-scroll"
          ref={scrollContainerRef}
          onScroll={handleScroll}
          tabIndex={-1}
          role="region"
          aria-label={`${totalCount} ${unitName} in the last 12 months. Scroll horizontally to inspect earlier weeks.`}
        >
          <div className="proof-heatmap-layout">
            {/* Sticky Mon/Wed/Fri labels gutter on left */}
            <div className="proof-day-labels" aria-hidden="true">
              <span className="proof-day-label" />
              <span className="proof-day-label">Mon</span>
              <span className="proof-day-label" />
              <span className="proof-day-label">Wed</span>
              <span className="proof-day-label" />
              <span className="proof-day-label">Fri</span>
              <span className="proof-day-label" />
            </div>

            {/* Main Grid Area */}
            <div className="proof-grid-container">
              {/* Month Labels Track: computed x from first week of month */}
              <div className="proof-month-row" aria-hidden="true">
                {monthLabels.map((m, idx) => (
                  <span
                    key={`${m.text}-${idx}`}
                    className="proof-month-label"
                    style={{ gridColumnStart: m.weekIndex + 1 }}
                  >
                    {m.text}
                  </span>
                ))}
              </div>

              {/* 53 Weeks Grid (12px cells, 3px gaps) */}
              <div
                className={`proof-weeks-grid ${hoveredWeek !== null ? "is-hovering" : ""}`}
                ref={gridRef}
                role="grid"
                aria-readonly="true"
                aria-label={`Activity calendar showing ${weeks.length} weeks of ${unitName}`}
              >
                {weeks.map((week, wIdx) => {
                  const isCurrentWeekHovered = hoveredWeek === wIdx;

                  return (
                    <div
                      key={`week-${wIdx}`}
                      className={`proof-week-col ${isCurrentWeekHovered ? "is-active-col" : ""}`}
                      role="row"
                      data-week={wIdx}
                    >
                      {Array.from({ length: 7 }).map((_, dIdx) => {
                        const day = week.contributionDays?.find((d) => d.weekday === dIdx);
                        const count = day?.contributionCount || 0;
                        const dateStr = day?.date || "";
                        const level = getLevel(count);

                        const isFocused =
                          (focusedCoord === null && wIdx === weeks.length - 1 && dIdx === 6) ||
                          (focusedCoord?.week === wIdx && focusedCoord?.day === dIdx);

                        const dayAria = dateStr
                          ? `${count} ${unitName} on ${formatDate(dateStr)}`
                          : "No data";

                        return (
                          <div
                            key={`cell-${wIdx}-${dIdx}`}
                            className={`proof-cell level-${level}`}
                            data-coord={`${wIdx}-${dIdx}`}
                            data-level={level}
                            data-week={wIdx}
                            data-day={dIdx}
                            role="gridcell"
                            tabIndex={isFocused ? 0 : -1}
                            aria-label={dayAria}
                            aria-describedby={fullTooltipId}
                            onMouseEnter={(e) => showTooltipForCell(e.currentTarget, count, dateStr, wIdx)}
                            onMouseLeave={handleCellMouseLeave}
                            onFocus={(e) => {
                              setFocusedCoord({ week: wIdx, day: dIdx });
                              showTooltipForCell(e.currentTarget, count, dateStr, wIdx);
                            }}
                            onBlur={handleCellMouseLeave}
                            onKeyDown={(e) => handleKeyDown(e, wIdx, dIdx)}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend: Less to More */}
      <div className="proof-heatmap-footer">
        <div className="proof-legend" aria-hidden="true">
          <span className="proof-legend-text">Less</span>
          <span className="proof-legend-cell level-0" />
          <span className="proof-legend-cell level-1" />
          <span className="proof-legend-cell level-2" />
          <span className="proof-legend-cell level-3" />
          <span className="proof-legend-cell level-4" />
          <span className="proof-legend-text">More</span>
        </div>
      </div>

      {/* Floating Tooltip */}
      {activeTooltip.visible && (
        <div
          id={fullTooltipId}
          className="proof-tooltip"
          role="tooltip"
          style={{
            position: "fixed",
            left: `${activeTooltip.x}px`,
            top: `${activeTooltip.y}px`,
            transform: "translate(-50%, -100%)",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        >
          {activeTooltip.text}
        </div>
      )}
    </div>
  );
};

export default Heatmap;
