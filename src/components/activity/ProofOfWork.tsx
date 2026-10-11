import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiRefreshCw } from "react-icons/fi";
import useActivity from "./useActivity";
import StatBand from "./StatBand";
import RhythmStrip from "./RhythmStrip";
import GithubCard from "./GithubCard";
import LeetcodeCard from "./LeetcodeCard";
import "../styles/ProofOfWork.css";

gsap.registerPlugin(ScrollTrigger);

type ActiveTab = "both" | "github" | "leetcode";

export const ProofOfWork: React.FC = () => {
  const { github, leetcode, isLoading, isRetrying, source, lastUpdated, refetch } = useActivity();
  const [activeTab, setActiveTab] = useState<ActiveTab>("both");
  const [underlineStyle, setUnderlineStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  const sectionRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const bothBtnRef = useRef<HTMLButtonElement>(null);
  const ghBtnRef = useRef<HTMLButtonElement>(null);
  const lcBtnRef = useRef<HTMLButtonElement>(null);

  // Update sliding underline position when activeTab changes
  useEffect(() => {
    let targetBtn: HTMLButtonElement | null = null;
    if (activeTab === "both") targetBtn = bothBtnRef.current;
    if (activeTab === "github") targetBtn = ghBtnRef.current;
    if (activeTab === "leetcode") targetBtn = lcBtnRef.current;

    if (targetBtn && tabsRef.current) {
      const tabsRect = tabsRef.current.getBoundingClientRect();
      const btnRect = targetBtn.getBoundingClientRect();
      setUnderlineStyle({
        left: btnRect.left - tabsRect.left,
        width: btnRect.width,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => {
      let targetBtn: HTMLButtonElement | null = null;
      if (activeTab === "both") targetBtn = bothBtnRef.current;
      if (activeTab === "github") targetBtn = ghBtnRef.current;
      if (activeTab === "leetcode") targetBtn = lcBtnRef.current;

      if (targetBtn && tabsRef.current) {
        const tabsRect = tabsRef.current.getBoundingClientRect();
        const btnRect = targetBtn.getBoundingClientRect();
        setUnderlineStyle({
          left: btnRect.left - tabsRect.left,
          width: btnRect.width,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab]);

  // Entrance animations for header block and cards
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".proof-header-block", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
      });

      gsap.from(".proof-cards-container", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
        y: 36,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="activity"
      ref={sectionRef}
      className="proof-section"
      aria-label="Proof of Work: Live GitHub and LeetCode activity"
    >
      <div className="proof-container">
        {/* Section Header */}
        <div className="proof-header-block">
          <div className="proof-eyebrow">PROOF OF WORK</div>
          <h2 className="proof-heading">
            Shipping, <em className="proof-heading-highlight">every day.</em>
          </h2>
          <p className="proof-subtitle">Live from GitHub and LeetCode.</p>

          {/* Status Pill: Cyan dot ONLY if genuine live; hollow white 40% dot if snapshot */}
          <div className="proof-meta-bar" role="status" aria-live="polite">
            {source === "live" ? (
              <>
                <span className="proof-live-pulse-dot" aria-hidden="true" />
                <span className="proof-meta-text">Live · {lastUpdated}</span>
              </>
            ) : (
              <>
                <span className="proof-snapshot-dot" aria-hidden="true" />
                <span className="proof-meta-text">Saved data · {lastUpdated}</span>
                <button
                  type="button"
                  className="proof-retry-btn"
                  onClick={() => refetch()}
                  disabled={isRetrying}
                  title="Retry fetching live data from APIs"
                >
                  <FiRefreshCw className={`proof-retry-icon ${isRetrying ? "is-spinning" : ""}`} />
                  <span>{isRetrying ? "Checking..." : "Retry"}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tab Controls with Shared Sliding Underline */}
        <div className="proof-tabs-wrapper">
          <div
            className="proof-tabs-bar"
            ref={tabsRef}
            role="tablist"
            aria-label="Filter activity by platform"
          >
            <button
              ref={bothBtnRef}
              type="button"
              role="tab"
              aria-selected={activeTab === "both"}
              aria-controls="proof-cards-view"
              id="tab-both"
              className={`proof-tab-btn ${activeTab === "both" ? "is-active" : ""}`}
              onClick={() => setActiveTab("both")}
            >
              Both
            </button>
            <button
              ref={ghBtnRef}
              type="button"
              role="tab"
              aria-selected={activeTab === "github"}
              aria-controls="proof-cards-view"
              id="tab-github"
              className={`proof-tab-btn ${activeTab === "github" ? "is-active" : ""}`}
              onClick={() => setActiveTab("github")}
            >
              GitHub
            </button>
            <button
              ref={lcBtnRef}
              type="button"
              role="tab"
              aria-selected={activeTab === "leetcode"}
              aria-controls="proof-cards-view"
              id="tab-leetcode"
              className={`proof-tab-btn ${activeTab === "leetcode" ? "is-active" : ""}`}
              onClick={() => setActiveTab("leetcode")}
            >
              LeetCode
            </button>

            {/* Sliding violet underline */}
            <span
              className="proof-sliding-underline"
              aria-hidden="true"
              style={{
                left: `${underlineStyle.left}px`,
                width: `${underlineStyle.width}px`,
              }}
            />
          </div>
        </div>

        {/* Headline Stat Band: 4 large numbers across full width */}
        <StatBand github={github} leetcode={leetcode} />

        {/* Rhythm Strip: 52-week stacked activity sparkline */}
        <RhythmStrip weeks={github.weeks} calendar={leetcode.calendar} />

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="proof-skeleton-wrap" aria-busy="true" aria-label="Loading activity data">
            <div className="proof-skeleton-card proof-skeleton-shimmer" />
            <div className="proof-skeleton-card proof-skeleton-shimmer" />
          </div>
        )}

        {/* Main Cards Content */}
        <div
          id="proof-cards-view"
          className={`proof-cards-container tab-view-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
        >
          {(activeTab === "both" || activeTab === "github") && (
            <GithubCard
              activity={github}
              isLoading={isLoading}
              showPinned={activeTab === "github"}
            />
          )}

          {(activeTab === "both" || activeTab === "leetcode") && (
            <LeetcodeCard
              activity={leetcode}
              referenceWeeks={github.weeks}
              isLoading={isLoading}
              showDetails={activeTab === "leetcode"}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ProofOfWork;
