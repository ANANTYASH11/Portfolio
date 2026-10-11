import React, { useMemo } from "react";
import { FiCode, FiExternalLink, FiCheckCircle, FiTag } from "react-icons/fi";
import RingChart from "./RingChart";
import Heatmap from "./Heatmap";
import { LeetcodeActivity, GithubWeek } from "./useActivity";
import { ACTIVITY_CONFIG } from "../../config/activityConfig";

export interface LeetcodeCardProps {
  activity: LeetcodeActivity;
  referenceWeeks?: GithubWeek[];
  isLoading?: boolean;
  showDetails?: boolean;
}

function formatSubmissionTime(ts: string | number): string {
  const num = Number(ts);
  if (!num) return "";
  const d = new Date(num > 1e11 ? num : num * 1000);
  const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diffSec < 3600) return `${Math.max(1, Math.floor(diffSec / 60))}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 86400 * 30) return `${Math.floor(diffSec / 86400)}d ago`;
  return d.toLocaleDateString("en-GB", { month: "short", day: "numeric" });
}

export const LeetcodeCard: React.FC<LeetcodeCardProps> = ({
  activity,
  referenceWeeks = [],
  isLoading = false,
  showDetails = false,
}) => {
  const {
    totalSolved = 0,
    totalQuestions = 4073,
    totalEasy = 969,
    totalMedium = 2124,
    totalHard = 980,
    easy = 0,
    medium = 0,
    hard = 0,
    ranking = 0,
    streak = 9,
    totalSubmissions = 128,
    totalActiveDays = 15,
    contestRating = null,
    calendar = {},
    recentSubmissions = [],
    topTopics = [],
  } = activity;

  // Convert submissionCalendar timestamps to a 53-week grid matching GitHub style
  const leetcodeWeeks: GithubWeek[] = useMemo(() => {
    const countByDate: Record<string, number> = {};
    Object.entries(calendar || {}).forEach(([tsStr, count]) => {
      const ts = Number(tsStr);
      if (!isNaN(ts)) {
        const d = new Date(ts > 1e11 ? ts : ts * 1000);
        const uy = d.getUTCFullYear();
        const um = String(d.getUTCMonth() + 1).padStart(2, "0");
        const uday = String(d.getUTCDate()).padStart(2, "0");
        const ukey = `${uy}-${um}-${uday}`;
        countByDate[ukey] = (countByDate[ukey] || 0) + count;

        const ly = d.getFullYear();
        const lm = String(d.getMonth() + 1).padStart(2, "0");
        const lday = String(d.getDate()).padStart(2, "0");
        const lkey = `${ly}-${lm}-${lday}`;
        if (lkey !== ukey) {
          countByDate[lkey] = (countByDate[lkey] || 0) + count;
        }
      }
    });

    if (referenceWeeks.length > 0) {
      return referenceWeeks.map((week) => ({
        contributionDays: week.contributionDays.map((d) => ({
          date: d.date,
          weekday: d.weekday,
          contributionCount: countByDate[d.date] || 0,
        })),
      }));
    }

    const weeks: GithubWeek[] = [];
    const today = new Date();
    const end = new Date(today);
    end.setDate(today.getDate() + (6 - today.getDay()));

    const totalDays = 53 * 7;
    const start = new Date(end);
    start.setDate(end.getDate() - totalDays + 1);

    let cur = new Date(start);
    let currentWeek: GithubWeek = { contributionDays: [] };

    for (let i = 0; i < totalDays; i++) {
      const y = cur.getFullYear();
      const m = String(cur.getMonth() + 1).padStart(2, "0");
      const d = String(cur.getDate()).padStart(2, "0");
      const dateStr = `${y}-${m}-${d}`;
      const weekday = cur.getDay();

      currentWeek.contributionDays.push({
        date: dateStr,
        weekday,
        contributionCount: countByDate[dateStr] || 0,
      });

      if (weekday === 6 || i === totalDays - 1) {
        weeks.push(currentWeek);
        currentWeek = { contributionDays: [] };
      }

      cur.setDate(cur.getDate() + 1);
    }

    return weeks;
  }, [calendar, referenceWeeks]);

  return (
    <div
      className={`proof-card proof-card-leetcode ${isLoading ? "is-loading" : ""}`}
      aria-label="LeetCode Progress Card"
    >
      {/* Card Header */}
      <div className="proof-card-header">
        <div className="proof-card-header-left">
          <div className="proof-card-avatar" aria-hidden="true">
            <FiCode className="proof-icon" />
          </div>
          <div>
            <h3 className="proof-card-title">LeetCode Progress</h3>
            <p className="proof-card-handle">@{ACTIVITY_CONFIG.LEETCODE_USERNAME}</p>
          </div>
        </div>

        <a
          href={ACTIVITY_CONFIG.LEETCODE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="proof-card-badge-link"
          aria-label={`Open LeetCode profile of ${ACTIVITY_CONFIG.LEETCODE_USERNAME} in new tab`}
        >
          <span>leetcode.com/u/{ACTIVITY_CONFIG.LEETCODE_USERNAME}</span>
          <FiExternalLink className="proof-badge-icon" />
        </a>
      </div>

      {/* Ring Chart & Key Stats Section (Balanced with GitHub card) */}
      <div className="proof-lc-top-section">
        <div className="proof-lc-ring-col">
          <RingChart
            totalSolved={totalSolved}
            totalQuestions={totalQuestions}
            easy={easy}
            medium={medium}
            hard={hard}
            totalEasy={totalEasy}
            totalMedium={totalMedium}
            totalHard={totalHard}
          />
        </div>

        <div className="proof-lc-stats-col" role="list">
          <div className="proof-lc-stat-item" role="listitem">
            <span className="proof-card-stat-label">GLOBAL RANK</span>
            <span className="proof-card-stat-val">
              {ranking > 0 ? `#${ranking.toLocaleString()}` : "#15,87,688"}
            </span>
            <span className="proof-card-stat-sub">Top 10% worldwide</span>
          </div>

          <div className="proof-card-stat-divider-h" aria-hidden="true" />

          <div className="proof-lc-stat-item" role="listitem">
            <span className="proof-card-stat-label">ACTIVE STREAK</span>
            <span className="proof-card-stat-val">
              {streak} <span className="stat-unit">days</span>
            </span>
            <span className="proof-card-stat-sub">
              {totalActiveDays} active days in past year
            </span>
          </div>

          {contestRating && contestRating > 0 ? (
            <>
              <div className="proof-card-stat-divider-h" aria-hidden="true" />
              <div className="proof-lc-stat-item" role="listitem">
                <span className="proof-card-stat-label">CONTEST RATING</span>
                <span className="proof-card-stat-val">{contestRating}</span>
                <span className="proof-card-stat-sub">Contest performance tier</span>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* 12-Month Submission Heatmap (Direct mirror to GitHub graph) */}
      <div className="proof-card-heatmap-area">
        <div className="proof-lc-heatmap-header">
          <span className="proof-lc-heatmap-title">
            {totalSubmissions || 128} SUBMISSIONS IN THE PAST YEAR
          </span>
          <span className="proof-lc-heatmap-sub">
            {totalActiveDays || 15} active days · Max streak {streak || 9} days
          </span>
        </div>
        <Heatmap weeks={leetcodeWeeks} unitName="submissions" idPrefix="lc" />
      </div>

      {/* Deep Dive Section: Recent Accepted & Top Topics when in LeetCode tab */}
      {showDetails && (
        <div className="proof-lc-depth-block">
          {/* Top Topics Chips */}
          {topTopics && topTopics.length > 0 && (
            <div className="proof-topics-section">
              <div className="proof-depth-header">
                <FiTag className="proof-depth-icon" aria-hidden="true" />
                <span>TOP TOPICS SOLVED</span>
              </div>
              <div className="proof-topics-chips">
                {topTopics.map((topic) => (
                  <span key={topic.name} className="proof-topic-chip">
                    <span className="proof-topic-name">{topic.name}</span>
                    <span className="proof-topic-count">{topic.count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recent Accepted Submissions */}
          {recentSubmissions && recentSubmissions.length > 0 && (
            <div className="proof-recent-section">
              <div className="proof-depth-header">
                <FiCheckCircle className="proof-depth-icon" aria-hidden="true" />
                <span>RECENT ACCEPTED SUBMISSIONS</span>
              </div>
              <div className="proof-recent-list">
                {recentSubmissions.slice(0, 5).map((sub) => (
                  <a
                    key={sub.titleSlug + sub.timestamp}
                    href={`https://leetcode.com/problems/${sub.titleSlug}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="proof-recent-row"
                  >
                    <div className="proof-recent-left">
                      <span className="proof-recent-dot" />
                      <span className="proof-recent-title">{sub.title}</span>
                    </div>
                    <span className="proof-recent-time">
                      {formatSubmissionTime(sub.timestamp)}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Link */}
      <div className="proof-card-footer">
        <a
          href={ACTIVITY_CONFIG.LEETCODE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="proof-footer-link"
        >
          <span>leetcode.com/u/{ACTIVITY_CONFIG.LEETCODE_USERNAME}</span>
          <span className="proof-arrow">↗</span>
        </a>
      </div>
    </div>
  );
};

export default LeetcodeCard;
