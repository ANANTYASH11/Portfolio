import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GithubActivity, LeetcodeActivity } from "./useActivity";

gsap.registerPlugin(ScrollTrigger);

export interface StatBandProps {
  github: GithubActivity;
  leetcode: LeetcodeActivity;
}

export const StatBand: React.FC<StatBandProps> = ({ github, leetcode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState({
    contributions: 0,
    longestStreak: 0,
    solved: 0,
    rank: 0,
  });

  const targetContributions = github.totalContributions || 0;
  const targetStreak = github.longestStreak || 0;
  const targetSolved = leetcode.totalSolved || 0;
  const targetRank = leetcode.ranking || 0;

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setCounts({
        contributions: targetContributions,
        longestStreak: targetStreak,
        solved: targetSolved,
        rank: targetRank,
      });
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const obj = { c: 0, s: 0, slv: 0, rk: 0 };

      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            c: targetContributions,
            s: targetStreak,
            slv: targetSolved,
            rk: targetRank,
            duration: 1.4,
            ease: "power2.out",
            onUpdate: () => {
              setCounts({
                contributions: Math.round(obj.c),
                longestStreak: Math.round(obj.s),
                solved: Math.round(obj.slv),
                rank: Math.round(obj.rk),
              });
            },
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [targetContributions, targetStreak, targetSolved, targetRank]);

  return (
    <div
      ref={containerRef}
      className="proof-stat-band"
      role="region"
      aria-label="High-level activity summary statistics"
    >
      <div className="proof-stat-band-cell">
        <span className="proof-stat-band-label">CONTRIBUTIONS (12 MO)</span>
        <span className="proof-stat-band-value">
          {counts.contributions.toLocaleString()}
        </span>
      </div>

      <div className="proof-stat-band-cell">
        <span className="proof-stat-band-label">LONGEST STREAK</span>
        <span className="proof-stat-band-value">
          {counts.longestStreak} <span className="stat-band-unit">days</span>
        </span>
      </div>

      <div className="proof-stat-band-cell">
        <span className="proof-stat-band-label">LEETCODE SOLVED</span>
        <span className="proof-stat-band-value">
          {counts.solved.toLocaleString()}
        </span>
      </div>

      <div className="proof-stat-band-cell">
        <span className="proof-stat-band-label">GLOBAL RANK</span>
        <span className="proof-stat-band-value">
          {counts.rank > 0 ? `#${counts.rank.toLocaleString()}` : "Top 10%"}
        </span>
      </div>
    </div>
  );
};

export default StatBand;
