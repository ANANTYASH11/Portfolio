import React, { useState } from "react";
import { ACADEMIC_COURSES } from "./academicsConfig";

interface CurriculumRailProps {
  onHoverCourse?: (index: number | null) => void;
}

export const CurriculumRail: React.FC<CurriculumRailProps> = ({
  onHoverCourse,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleMouseEnter = (idx: number) => {
    setHoveredIdx(idx);
    onHoverCourse?.(idx);
  };

  const handleMouseLeave = () => {
    setHoveredIdx(null);
    onHoverCourse?.(null);
  };

  return (
    <aside
      className="academics-curriculum-rail"
      aria-label="IIT Guwahati Computer Science curriculum at a glance"
    >
      <div className="curriculum-rail-inner">
        <header className="curriculum-rail-header">
          <span className="curriculum-rail-label">THE CURRICULUM</span>
        </header>

        <ol className="curriculum-rail-list">
          {ACADEMIC_COURSES.map((course, idx) => {
            const isHovered = hoveredIdx === idx;

            return (
              <li
                key={course.code}
                className={`curriculum-row-item ${
                  isHovered ? "row-hovered" : ""
                }`}
                onMouseEnter={() => handleMouseEnter(idx)}
                onMouseLeave={handleMouseLeave}
                onFocus={() => handleMouseEnter(idx)}
                onBlur={handleMouseLeave}
                tabIndex={0}
                style={{
                  animationDelay: `${idx * 0.06}s`,
                }}
              >
                {/* Thin 1px lavender connector line drawn to certificate edge on hover */}
                <div className="curriculum-connector-line" aria-hidden="true">
                  <svg
                    className="connector-svg"
                    width="48"
                    height="12"
                    viewBox="0 0 48 12"
                    fill="none"
                  >
                    <path
                      d="M48 6 L0 6"
                      stroke="rgba(196, 129, 255, 0.4)"
                      strokeWidth="1"
                      strokeDasharray="48"
                      strokeDashoffset={isHovered ? "0" : "48"}
                      className="connector-path"
                    />
                  </svg>
                </div>

                <div className="curriculum-row-content">
                  <span className="curriculum-course-code">{course.code}</span>
                  <span className="curriculum-course-title">{course.title}</span>
                  <span
                    className="curriculum-cyan-dot"
                    aria-label="Verified completion"
                    title="Verified completion"
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
};

export default CurriculumRail;
