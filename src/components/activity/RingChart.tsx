import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export interface RingChartProps {
  totalSolved: number;
  totalQuestions?: number;
  easy: number;
  medium: number;
  hard: number;
  totalEasy?: number;
  totalMedium?: number;
  totalHard?: number;
}

type Difficulty = "easy" | "medium" | "hard" | null;

export const RingChart: React.FC<RingChartProps> = ({
  totalSolved,
  totalQuestions = 4073,
  easy,
  medium,
  hard,
  totalEasy = 969,
  totalMedium = 2124,
  totalHard = 980,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredDiff, setHoveredDiff] = useState<Difficulty>(null);
  const [animatedTotal, setAnimatedTotal] = useState(0);

  // Compact Geometry for side-by-side card balance with GitHub
  const size = 136;
  const strokeWidth = 9;
  const radius = 52;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius; // ~326.7px

  // 3-degree gap between 3 segments
  const gapDeg = 3;
  const totalGapDeg = gapDeg * 3; // 9 degrees
  const availableDeg = 360 - totalGapDeg; // 351 degrees

  const safeTotal = Math.max(totalSolved, 1);
  const degEasy = Math.max((easy / safeTotal) * availableDeg, 2);
  const degMedium = Math.max((medium / safeTotal) * availableDeg, 2);
  const degHard = Math.max((hard / safeTotal) * availableDeg, 2);

  const lenEasy = (degEasy / 360) * circumference;
  const lenMedium = (degMedium / 360) * circumference;
  const lenHard = (degHard / 360) * circumference;

  // Starting angles in degrees (offset by -90 so top is 0)
  const rotEasy = -90;
  const rotMedium = rotEasy + degEasy + gapDeg;
  const rotHard = rotMedium + degMedium + gapDeg;

  // Arc Draw & Number Count-up Animation (1.2s, expo.out)
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setAnimatedTotal(totalSolved);
      return;
    }

    const ctx = gsap.context(() => {
      const counter = { val: 0 };
      gsap.to(counter, {
        val: totalSolved,
        duration: 1.2,
        ease: "expo.out",
        onUpdate: () => setAnimatedTotal(Math.round(counter.val)),
      });

      const rings = containerRef.current?.querySelectorAll(".proof-ring-segment");
      if (rings) {
        gsap.fromTo(
          rings,
          { strokeDashoffset: circumference, opacity: 0 },
          {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.15,
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [totalSolved, circumference]);

  const ariaDescription = `${totalSolved} solved of ${totalQuestions} problems: ${easy} easy, ${medium} medium, ${hard} hard out of standard problem set.`;

  return (
    <div
      ref={containerRef}
      className="proof-ring-container"
      role="region"
      aria-label={ariaDescription}
    >
      {/* Donut Ring with Center Number */}
      <div className="proof-ring-svg-wrap">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="proof-ring-svg"
          aria-hidden="true"
        >
          {/* Subtle Background Circle Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth={strokeWidth}
          />

          {/* Easy Segment: Lavender #c4b5fd */}
          <circle
            className={`proof-ring-segment seg-easy ${
              hoveredDiff && hoveredDiff !== "easy" ? "is-dimmed" : ""
            } ${hoveredDiff === "easy" ? "is-highlighted" : ""}`}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#c4b5fd"
            strokeWidth={strokeWidth}
            strokeDasharray={`${lenEasy} ${circumference}`}
            strokeLinecap="round"
            transform={`rotate(${rotEasy} ${center} ${center})`}
            onMouseEnter={() => setHoveredDiff("easy")}
            onMouseLeave={() => setHoveredDiff(null)}
          />

          {/* Medium Segment: Violet #8b5cf6 */}
          <circle
            className={`proof-ring-segment seg-medium ${
              hoveredDiff && hoveredDiff !== "medium" ? "is-dimmed" : ""
            } ${hoveredDiff === "medium" ? "is-highlighted" : ""}`}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth={strokeWidth}
            strokeDasharray={`${lenMedium} ${circumference}`}
            strokeLinecap="round"
            transform={`rotate(${rotMedium} ${center} ${center})`}
            onMouseEnter={() => setHoveredDiff("medium")}
            onMouseLeave={() => setHoveredDiff(null)}
          />

          {/* Hard Segment: White 70% */}
          <circle
            className={`proof-ring-segment seg-hard ${
              hoveredDiff && hoveredDiff !== "hard" ? "is-dimmed" : ""
            } ${hoveredDiff === "hard" ? "is-highlighted" : ""}`}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.7)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${lenHard} ${circumference}`}
            strokeLinecap="round"
            transform={`rotate(${rotHard} ${center} ${center})`}
            onMouseEnter={() => setHoveredDiff("hard")}
            onMouseLeave={() => setHoveredDiff(null)}
          />
        </svg>

        {/* Center Total Solved + Total Questions */}
        <div className="proof-ring-center-content">
          <span className="proof-ring-total-num">{animatedTotal}</span>
          <span className="proof-ring-sub-count">/{totalQuestions.toLocaleString()}</span>
          <span className="proof-ring-total-label">SOLVED</span>
        </div>
      </div>

      {/* Difficulty Breakdown Bars (Compact Side Stack) */}
      <div className="proof-ring-breakdown" role="list">
        {/* Easy */}
        <div
          className={`proof-diff-row ${
            hoveredDiff && hoveredDiff !== "easy" ? "is-dimmed" : ""
          } ${hoveredDiff === "easy" ? "is-highlighted" : ""}`}
          role="listitem"
          onMouseEnter={() => setHoveredDiff("easy")}
          onMouseLeave={() => setHoveredDiff(null)}
        >
          <div className="proof-diff-info">
            <span className="proof-diff-name">
              <span className="proof-diff-dot dot-easy" />
              Easy
            </span>
            <span className="proof-diff-val">
              <strong>{easy}</strong> <span className="diff-slash">/</span> {totalEasy}
            </span>
          </div>
          <div className="proof-diff-track">
            <div
              className="proof-diff-bar fill-easy"
              style={{ width: `${Math.min((easy / totalEasy) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Medium */}
        <div
          className={`proof-diff-row ${
            hoveredDiff && hoveredDiff !== "medium" ? "is-dimmed" : ""
          } ${hoveredDiff === "medium" ? "is-highlighted" : ""}`}
          role="listitem"
          onMouseEnter={() => setHoveredDiff("medium")}
          onMouseLeave={() => setHoveredDiff(null)}
        >
          <div className="proof-diff-info">
            <span className="proof-diff-name">
              <span className="proof-diff-dot dot-medium" />
              Medium
            </span>
            <span className="proof-diff-val">
              <strong>{medium}</strong> <span className="diff-slash">/</span> {totalMedium}
            </span>
          </div>
          <div className="proof-diff-track">
            <div
              className="proof-diff-bar fill-medium"
              style={{ width: `${Math.min((medium / totalMedium) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Hard */}
        <div
          className={`proof-diff-row ${
            hoveredDiff && hoveredDiff !== "hard" ? "is-dimmed" : ""
          } ${hoveredDiff === "hard" ? "is-highlighted" : ""}`}
          role="listitem"
          onMouseEnter={() => setHoveredDiff("hard")}
          onMouseLeave={() => setHoveredDiff(null)}
        >
          <div className="proof-diff-info">
            <span className="proof-diff-name">
              <span className="proof-diff-dot dot-hard" />
              Hard
            </span>
            <span className="proof-diff-val">
              <strong>{hard}</strong> <span className="diff-slash">/</span> {totalHard}
            </span>
          </div>
          <div className="proof-diff-track">
            <div
              className="proof-diff-bar fill-hard"
              style={{ width: `${Math.min((hard / totalHard) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RingChart;
