import React, { useEffect, useRef, useState } from "react";
import { ProjectData } from "../data/projects";
import { FiX, FiExternalLink, FiGithub, FiPlay, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import "./styles/CaseStudyPanel.css";

interface CaseStudyPanelProps {
  project: ProjectData;
  onClose: () => void;
  triggerElement?: HTMLElement | null;
}

export const CaseStudyPanel: React.FC<CaseStudyPanelProps> = ({
  project,
  onClose,
  triggerElement,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Demo area state
  const [demoLoaded, setDemoLoaded] = useState(false);
  const [iframeBlocked, setIframeBlocked] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(false);

  // Focus trap & Escape key listener
  useEffect(() => {
    // Focus close button on mount
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && panelRef.current) {
        const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      // Return focus to triggering card button
      triggerElement?.focus();
    };
  }, [onClose, triggerElement]);

  const handleLoadDemo = () => {
    setDemoLoaded(true);
    if (project.demoUrl) {
      setIframeLoading(true);
    }
  };

  return (
    <div
      className="case-study-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`case-study-title-${project.id}`}
      onClick={onClose}
    >
      <div
        className="case-study-panel"
        ref={panelRef}
        id="case-study-panel"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Top Header Navigation */}
        <div className="case-study-top-nav">
          <div className="case-study-number-badge">
            <span className="case-study-live-dot" />
            <span>PROJECT CASE STUDY · {project.number}</span>
          </div>

          <button
            ref={closeBtnRef}
            className="case-study-close-btn"
            onClick={onClose}
            aria-label="Close Case Study"
          >
            <FiX size={16} />
            <span>Close</span>
            <span className="esc-pill">Esc</span>
          </button>
        </div>

        {/* Hero & One-line Summary */}
        <div className="case-study-hero">
          <span className="case-study-category">{project.category}</span>
          <h2 id={`case-study-title-${project.id}`} className="case-study-title">
            {project.title}
          </h2>
          <p className="case-study-summary">{project.summary}</p>

          {/* Meta Row: Role & Timeline */}
          <div className="case-study-meta-row">
            <div className="case-study-meta-item">
              <span className="case-study-meta-label">ROLE</span>
              <span className="case-study-meta-value">{project.role}</span>
            </div>
            <div className="case-study-meta-item">
              <span className="case-study-meta-label">TIMELINE</span>
              <span className="case-study-meta-value">{project.timeline}</span>
            </div>
            <div className="case-study-meta-item">
              <span className="case-study-meta-label">STATUS</span>
              <span className="case-study-meta-value" style={{ color: "#00f0ff" }}>
                Verified Production
              </span>
            </div>
          </div>
        </div>

        {/* Stack Chips (reusing Tech Stack chip style) */}
        <div className="case-study-chips-wrap">
          <span className="case-study-section-label">TECHNOLOGY STACK</span>
          <div className="case-study-chips">
            {project.tools.map((tool, idx) => (
              <span key={idx} className="case-study-chip">
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Metrics Row (Resume Verified Numbers Only) */}
        <div className="case-study-chips-wrap">
          <span className="case-study-section-label">VERIFIED RESUME METRICS</span>
          <div className="case-study-metrics-grid">
            {project.metrics.map((metric, idx) => (
              <div key={idx} className="case-study-metric-card">
                <span className="case-study-metric-value">{metric.value}</span>
                <span className="case-study-metric-label">{metric.label}</span>
                <p className="case-study-metric-detail">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Problem / Approach / Result Blocks */}
        <div className="case-study-chips-wrap">
          <span className="case-study-section-label">SYSTEM ARCHITECTURE BREAKDOWN</span>
          <div className="case-study-blocks-grid">
            <div className="case-study-block-card">
              <span className="case-study-block-badge">01 / PROBLEM</span>
              <h4 className="case-study-block-heading">Core Challenge</h4>
              <p className="case-study-block-body">{project.problem}</p>
            </div>

            <div className="case-study-block-card">
              <span className="case-study-block-badge">02 / APPROACH</span>
              <h4 className="case-study-block-heading">Engineered Solution</h4>
              <p className="case-study-block-body">{project.approach}</p>
            </div>

            <div className="case-study-block-card">
              <span className="case-study-block-badge">03 / RESULT</span>
              <h4 className="case-study-block-heading">Quantified Impact</h4>
              <p className="case-study-block-body">{project.result}</p>
            </div>
          </div>
        </div>

        {/* Architecture Diagram (inline SVG) */}
        <div className="case-study-diagram-container">
          <span className="case-study-section-label">DATA PIPELINE & TOPOLOGY</span>
          <div
            className="case-study-diagram-box"
            dangerouslySetInnerHTML={{ __html: project.diagram }}
          />
        </div>

        {/* Demo Area (Lazy loaded behind button with poster & screenshot fallback) */}
        <div className="case-study-demo-container">
          <span className="case-study-section-label">INTERACTIVE DEMO / PREVIEW</span>
          <div className="case-study-demo-stage">
            {!demoLoaded ? (
              <>
                <img
                  src={project.image}
                  alt={`${project.title} Preview`}
                  className="case-study-demo-poster"
                  loading="lazy"
                />
                <div className="case-study-demo-overlay">
                  <button
                    className="case-study-load-demo-btn"
                    onClick={handleLoadDemo}
                  >
                    <FiPlay size={16} />
                    <span>Load live demo</span>
                  </button>
                  <p className="case-study-demo-subtext">
                    On-demand execution · Zero network overhead until requested
                  </p>
                </div>
              </>
            ) : project.demoUrl && !iframeBlocked ? (
              <div className="case-study-iframe-wrapper">
                <div className="case-study-iframe-bar">
                  <span>LIVE ENVIRONMENT · {project.demoUrl}</span>
                  <button
                    className="case-study-close-btn"
                    style={{ padding: "4px 10px", fontSize: "11px" }}
                    onClick={() => {
                      setIframeLoading(true);
                      const iframe = document.getElementById("demo-iframe") as HTMLIFrameElement;
                      if (iframe) iframe.src = project.demoUrl;
                    }}
                  >
                    <FiRefreshCw size={12} /> Reload
                  </button>
                </div>
                {iframeLoading && (
                  <div
                    style={{
                      position: "absolute",
                      inset: "40px 0 0 0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#0b0912",
                      color: "#c4b5fd",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "12px",
                      zIndex: 3,
                    }}
                  >
                    Connecting to live deployment...
                  </div>
                )}
                <iframe
                  id="demo-iframe"
                  src={project.demoUrl}
                  title={`${project.title} Live Demo`}
                  className="case-study-iframe"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  loading="lazy"
                  onLoad={() => setIframeLoading(false)}
                  onError={() => {
                    setIframeBlocked(true);
                    setIframeLoading(false);
                  }}
                />
              </div>
            ) : project.videoSrc ? (
              <video
                src={project.videoSrc}
                poster={project.image}
                autoPlay
                muted
                loop
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              /* Fallback Screenshot if iframe is blocked or no external live embed */
              <div className="case-study-demo-fallback">
                <img
                  src={project.image}
                  alt={`${project.title} Interface`}
                  className="case-study-demo-fallback-img"
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#c4b5fd",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "12px",
                  }}
                >
                  <FiAlertCircle color="#00f0ff" />
                  <span>
                    {iframeBlocked
                      ? "Direct frame embedding restricted by origin policy · Open live deployment below"
                      : "High-fidelity production snapshot verified"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions: Live & GitHub Links */}
        <div className="case-study-actions-row">
          <div className="case-study-links-group">
            {project.links.live ? (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="case-study-btn-primary"
              >
                <span>Open Live Project</span>
                <FiExternalLink size={15} />
              </a>
            ) : (
              <span className="case-study-btn-disabled">
                [Live deployment in progress · Available soon]
              </span>
            )}

            {project.links.github ? (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="case-study-btn-secondary"
              >
                <FiGithub size={16} />
                <span>Source Repository</span>
              </a>
            ) : (
              <span className="case-study-btn-disabled">
                [Source code available on request]
              </span>
            )}
          </div>

          <button className="case-study-close-btn" onClick={onClose}>
            <span>Back to Work</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyPanel;
