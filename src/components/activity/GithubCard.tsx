import React from "react";
import { FiGithub, FiExternalLink, FiStar, FiGitBranch } from "react-icons/fi";
import Heatmap from "./Heatmap";
import { GithubActivity } from "./useActivity";
import { ACTIVITY_CONFIG } from "../../config/activityConfig";

export interface GithubCardProps {
  activity: GithubActivity;
  isLoading?: boolean;
  showPinned?: boolean;
}

export const GithubCard: React.FC<GithubCardProps> = ({
  activity,
  isLoading = false,
  showPinned = false,
}) => {
  const {
    totalContributions = 0,
    weeks = [],
    currentStreak = 0,
    longestStreak = 0,
    topLanguages = [],
    pinnedRepositories = [],
  } = activity;

  // Lavender/violet monotone shades for segmented language bar
  const langShades = ["#c4b5fd", "#8b5cf6", "rgba(196, 181, 253, 0.45)"];

  return (
    <div
      className={`proof-card proof-card-github ${isLoading ? "is-loading" : ""}`}
      aria-label="GitHub Contributions Card"
    >
      {/* Card Header */}
      <div className="proof-card-header">
        <div className="proof-card-header-left">
          <div className="proof-card-avatar" aria-hidden="true">
            <FiGithub className="proof-icon" />
          </div>
          <div>
            <h3 className="proof-card-title">GitHub Activity</h3>
            <p className="proof-card-handle">@{ACTIVITY_CONFIG.GITHUB_USERNAME}</p>
          </div>
        </div>

        <a
          href={`https://github.com/${ACTIVITY_CONFIG.GITHUB_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="proof-card-badge-link"
          aria-label={`Open GitHub profile of ${ACTIVITY_CONFIG.GITHUB_USERNAME} in new tab`}
        >
          <span>github.com/{ACTIVITY_CONFIG.GITHUB_USERNAME}</span>
          <FiExternalLink className="proof-badge-icon" />
        </a>
      </div>

      {/* Inner Stat Dividers (Less Boxy: no individual tile borders or backgrounds) */}
      <div className="proof-card-stat-band" role="list">
        <div className="proof-card-stat-col" role="listitem">
          <span className="proof-card-stat-label">CONTRIBUTIONS</span>
          <span className="proof-card-stat-val">{totalContributions.toLocaleString()}</span>
          <span className="proof-card-stat-sub">Past 12 months</span>
        </div>

        <div className="proof-card-stat-divider" aria-hidden="true" />

        <div className="proof-card-stat-col" role="listitem">
          <span className="proof-card-stat-label">CURRENT STREAK</span>
          <span className="proof-card-stat-val">
            {currentStreak} <span className="stat-unit">days</span>
          </span>
          <span className="proof-card-stat-sub">Active daily streak</span>
        </div>

        <div className="proof-card-stat-divider" aria-hidden="true" />

        <div className="proof-card-stat-col" role="listitem">
          <span className="proof-card-stat-label">LONGEST STREAK</span>
          <span className="proof-card-stat-val">
            {longestStreak} <span className="stat-unit">days</span>
          </span>
          <span className="proof-card-stat-sub">All-time record</span>
        </div>
      </div>

      {/* Top Languages Thin Segmented Bar */}
      {topLanguages.length > 0 && (
        <div className="proof-lang-section">
          <div className="proof-lang-header">
            <span className="proof-lang-title">TOP LANGUAGES</span>
            <div className="proof-lang-legend">
              {topLanguages.map((lang, idx) => (
                <span key={lang.name} className="proof-lang-pill">
                  <span
                    className="proof-lang-dot"
                    style={{ backgroundColor: langShades[idx % langShades.length] }}
                  />
                  <span className="proof-lang-name">{lang.name}</span>
                  <span className="proof-lang-pct">{lang.percentage}%</span>
                </span>
              ))}
            </div>
          </div>

          <div
            className="proof-lang-bar"
            role="progressbar"
            aria-label="Top repository languages breakdown"
          >
            {topLanguages.map((lang, idx) => (
              <div
                key={lang.name}
                className="proof-lang-segment"
                style={{
                  width: `${lang.percentage}%`,
                  backgroundColor: langShades[idx % langShades.length],
                }}
                title={`${lang.name}: ${lang.percentage}%`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Heatmap Area */}
      <div className="proof-card-heatmap-area">
        <Heatmap weeks={weeks} unitName="contributions" idPrefix="gh" />
      </div>

      {/* Pinned Repositories: displayed when showPinned is active and items exist */}
      {showPinned && pinnedRepositories && pinnedRepositories.length > 0 && (
        <div className="proof-pinned-section">
          <div className="proof-pinned-header">
            <FiGitBranch className="proof-pinned-icon" aria-hidden="true" />
            <span>PINNED REPOSITORIES</span>
          </div>

          <div className="proof-pinned-grid">
            {pinnedRepositories.map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="proof-pinned-card"
              >
                <div className="proof-pinned-top">
                  <span className="proof-pinned-name">{repo.name}</span>
                  <FiExternalLink className="proof-pinned-arrow" />
                </div>
                {repo.description && (
                  <p className="proof-pinned-desc">{repo.description}</p>
                )}
                <div className="proof-pinned-meta">
                  {repo.language && (
                    <span className="proof-pinned-lang">
                      <span
                        className="proof-lang-dot"
                        style={{ backgroundColor: repo.language.color || "#8b5cf6" }}
                      />
                      <span>{repo.language.name}</span>
                    </span>
                  )}
                  {repo.stars > 0 && (
                    <span className="proof-pinned-stars">
                      <FiStar className="proof-star-icon" />
                      <span>{repo.stars}</span>
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Footer Link */}
      <div className="proof-card-footer">
        <a
          href={`https://github.com/${ACTIVITY_CONFIG.GITHUB_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="proof-footer-link"
        >
          <span>github.com/{ACTIVITY_CONFIG.GITHUB_USERNAME}</span>
          <span className="proof-arrow">↗</span>
        </a>
      </div>
    </div>
  );
};

export default GithubCard;
