import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ACADEMIC_FACTS } from "./academicsConfig";

gsap.registerPlugin(ScrollTrigger);

export const StatRail: React.FC = () => {
  const railRef = useRef<HTMLDivElement>(null);
  const [coursesCount, setCoursesCount] = useState<number>(0);
  const [cgpaVal, setCgpaVal] = useState<string>("0.0");

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    const isReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isReducedMotion) {
      setCoursesCount(ACADEMIC_FACTS.coursesCount);
      setCgpaVal(ACADEMIC_FACTS.cgpa.toFixed(1));
      return;
    }

    const ctx = gsap.context(() => {
      const statsObj = { count: 0, cgpa: 0 };

      ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(statsObj, {
            count: ACADEMIC_FACTS.coursesCount,
            cgpa: ACADEMIC_FACTS.cgpa,
            duration: 1.2,
            ease: "power2.out",
            onUpdate: () => {
              setCoursesCount(Math.round(statsObj.count));
              setCgpaVal(statsObj.cgpa.toFixed(1));
            },
          });
        },
      });
    }, el);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <aside
      ref={railRef}
      className="academics-stat-rail"
      aria-label="Academic metrics at a glance"
    >
      <div className="stat-rail-inner">
        <header className="stat-rail-header">
          <span className="stat-rail-label">AT A GLANCE</span>
        </header>

        <dl className="stat-rail-list">
          {/* Stat 1: 6 / 6 courses completed */}
          <div className="stat-block">
            <dd className="stat-number tabular-nums">
              {coursesCount} / {ACADEMIC_FACTS.coursesTotal}
            </dd>
            <dt className="stat-caption">courses completed</dt>
          </div>

          {/* Stat 2: 7.2 CGPA */}
          <div className="stat-block">
            <dd className="stat-number tabular-nums">{cgpaVal}</dd>
            <dt className="stat-caption">CGPA, Minor in Computer Science</dt>
          </div>

          {/* Stat 3: 2024 – 2026 duration */}
          <div className="stat-block">
            <dd className="stat-number tabular-nums">2024 – 2026</dd>
            <dt className="stat-caption">programme duration</dt>
          </div>
        </dl>
      </div>
    </aside>
  );
};

export default StatRail;
