import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import {
  FiCheckCircle,
  FiExternalLink,
  FiFileText,
  FiDownload,
  FiShield,
  FiX,
} from "react-icons/fi";
import { MdQrCode } from "react-icons/md";
import {
  ACADEMICS_CONFIG,
  ACADEMIC_COURSES,
  ACADEMIC_FACTS,
} from "./academicsConfig";

interface SubPanelProps {
  isOpen: boolean;
  onOpenLightbox: (doc: "certificate" | "transcript") => void;
}

// ─── LEFT PANEL: TRANSCRIPT ───
export const TranscriptPanel: React.FC<SubPanelProps> = ({
  isOpen,
  onOpenLightbox,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);

  return (
    <aside
      ref={panelRef}
      id="academics-transcript-panel"
      className={`academics-side-panel left-panel ${
        isOpen ? "panel-visible" : "panel-hidden"
      }`}
      aria-hidden={!isOpen}
      {...(!isOpen ? { inert: "" } : {})}
    >
      <div className="panel-inner glass-card">
        <div className="panel-header">
          <div className="panel-eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            <span>OFFICIAL TRANSCRIPT</span>
          </div>
          <h3 className="panel-title">Curriculum & Credits</h3>
          <p className="panel-meta-note">
            6 CS modules · Rigorous university evaluation
          </p>
        </div>

        <div
          className="transcript-list"
          role="list"
          aria-label="IIT Guwahati Computer Science Courses"
        >
          {ACADEMIC_COURSES.map((course, idx) => {
            const isHovered = hoveredCourse === course.code;
            return (
              <div
                key={course.code}
                className={`transcript-row-item ${
                  isHovered ? "row-expanded" : ""
                }`}
                role="listitem"
                onMouseEnter={() => setHoveredCourse(course.code)}
                onMouseLeave={() => setHoveredCourse(null)}
                onFocus={() => setHoveredCourse(course.code)}
                onBlur={() => setHoveredCourse(null)}
                tabIndex={isOpen ? 0 : -1}
                aria-expanded={isHovered}
                style={{
                  transitionDelay: `${idx * ACADEMICS_CONFIG.transcriptStagger}s`,
                }}
              >
                <div className="row-main">
                  <span className="course-code">{course.code}</span>
                  <span className="course-title">{course.title}</span>
                  <span className="course-status-badge">
                    <FiCheckCircle className="status-icon" aria-hidden="true" />
                    <span>{course.status}</span>
                  </span>
                </div>

                {/* Expand in place 1-line description on hover/focus */}
                <div
                  className={`course-accordion-desc ${
                    isHovered ? "desc-visible" : ""
                  }`}
                >
                  <p>{course.description}</p>
                  {course.isCapstone && (
                    <a
                      href={ACADEMIC_FACTS.capstoneRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="capstone-repo-link"
                      tabIndex={isHovered && isOpen ? 0 : -1}
                      data-cursor="pointer"
                    >
                      <span>View Repository</span>
                      <FiExternalLink />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="panel-footer-action">
          <button
            type="button"
            className="transcript-view-btn text-draw-link"
            onClick={() => onOpenLightbox("transcript")}
            tabIndex={isOpen ? 0 : -1}
            data-cursor="pointer"
          >
            <FiFileText aria-hidden="true" />
            <span>Inspect Grade Sheet Transcript ↗</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

// ─── RIGHT PANEL: FACTS & STATS ───
export const FactsPanel: React.FC<SubPanelProps> = ({
  isOpen,
  onOpenLightbox,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [coursesCount, setCoursesCount] = useState(0);
  const [cgpaVal, setCgpaVal] = useState("0.0");
  const [showQrModal, setShowQrModal] = useState(false);

  // GSAP Count-up animation for stats when isOpen becomes true
  useEffect(() => {
    if (!isOpen) return;

    const statsObj = { count: 0, cgpa: 0 };
    const tween = gsap.to(statsObj, {
      count: ACADEMIC_FACTS.coursesCount,
      cgpa: ACADEMIC_FACTS.cgpa,
      duration: 1.2,
      ease: "power2.out",
      onUpdate: () => {
        setCoursesCount(Math.round(statsObj.count));
        setCgpaVal(statsObj.cgpa.toFixed(1));
      },
    });

    return () => {
      tween.kill();
    };
  }, [isOpen]);

  return (
    <>
      <aside
        ref={panelRef}
        id="academics-facts-panel"
        className={`academics-side-panel right-panel ${
          isOpen ? "panel-visible" : "panel-hidden"
        }`}
        aria-hidden={!isOpen}
        {...(!isOpen ? { inert: "" } : {})}
      >
        <div className="panel-inner glass-card">
          <div className="panel-header">
            <div className="panel-eyebrow">
              <span className="eyebrow-dot cyan" aria-hidden="true" />
              <span>CREDENTIAL FACTS</span>
            </div>
            <h3 className="panel-title">Verification & Metrics</h3>
            <p className="panel-meta-note">
              Indian Institute of Technology Guwahati
            </p>
          </div>

          <div className="facts-stack">
            {/* Stat 1: 6 / 6 Completed with animated count-up */}
            <div className="fact-item">
              <div className="fact-num-row">
                <span className="fact-number tabular-nums">
                  {coursesCount} / {ACADEMIC_FACTS.coursesTotal}
                </span>
                <span className="fact-tag green">100% Cleared</span>
              </div>
              <span className="fact-label">Courses Completed</span>
            </div>

            {/* Stat 2: CGPA 7.2 with animated count-up */}
            <div className="fact-item">
              <div className="fact-num-row">
                <span className="fact-number tabular-nums">{cgpaVal}</span>
                <span className="fact-tag violet">First Class</span>
              </div>
              <span className="fact-label">CGPA (IIT Guwahati Minor)</span>
            </div>

            {/* Fact 3: Timeline */}
            <div className="fact-item">
              <div className="fact-text-value">{ACADEMIC_FACTS.timeline}</div>
              <span className="fact-label">Academic Duration</span>
            </div>

            {/* Fact 4: Governance */}
            <div className="fact-item">
              <div className="fact-text-sub">
                Daksh Gurukul · NSDC (Ministry of Skill Development, Govt. of India)
              </div>
              <span className="fact-label">Issuing Authority</span>
            </div>
          </div>

          {/* Action Links with underline-draw hover */}
          <div className="facts-action-links">
            <button
              type="button"
              className="fact-action-link text-draw-link"
              onClick={() => onOpenLightbox("certificate")}
              tabIndex={isOpen ? 0 : -1}
              data-cursor="pointer"
            >
              <span>Certificate ↗</span>
            </button>

            <button
              type="button"
              className="fact-action-link text-draw-link"
              onClick={() => onOpenLightbox("transcript")}
              tabIndex={isOpen ? 0 : -1}
              data-cursor="pointer"
            >
              <span>Transcript ↗</span>
            </button>

            <button
              type="button"
              className="fact-action-link text-draw-link cyan-link"
              onClick={() => setShowQrModal(true)}
              tabIndex={isOpen ? 0 : -1}
              data-cursor="pointer"
            >
              <MdQrCode className="link-icon" aria-hidden="true" />
              <span>Verify QR ↗</span>
            </button>

            <a
              href={ACADEMIC_FACTS.pdfPath}
              download="Anant_Yash_IIT_Guwahati_CS_ReportCard.pdf"
              className="fact-action-link text-draw-link download-link"
              tabIndex={isOpen ? 0 : -1}
              data-cursor="pointer"
            >
              <FiDownload className="link-icon" aria-hidden="true" />
              <span>Official PDF ↗</span>
            </a>
          </div>
        </div>
      </aside>

      {/* ─── QR / Official Credential Verification Modal ─── */}
      {showQrModal &&
        createPortal(
          <div
            className="qr-verification-modal-backdrop"
            onClick={() => setShowQrModal(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-modal-title"
          >
            <div
              className="qr-verification-modal-card glass-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="qr-modal-header">
                <div className="qr-modal-badge">
                  <FiShield aria-hidden="true" />
                  <span>OFFICIAL VERIFICATION</span>
                </div>
                <button
                  type="button"
                  className="qr-modal-close"
                  onClick={() => setShowQrModal(false)}
                  aria-label="Close verification modal"
                >
                  <FiX />
                </button>
              </div>

              <h4 id="qr-modal-title">IIT Guwahati Academic Credential</h4>
              <p className="qr-modal-desc">
                Scan QR code on certificate or verify with credentials below:
              </p>

              <div className="qr-details-table">
                <div className="qr-detail-row">
                  <span className="qr-detail-label">Candidate</span>
                  <span className="qr-detail-val">{ACADEMIC_FACTS.candidateName}</span>
                </div>
                <div className="qr-detail-row">
                  <span className="qr-detail-label">Student ID</span>
                  <span className="qr-detail-val font-mono">{ACADEMIC_FACTS.studentId}</span>
                </div>
                <div className="qr-detail-row">
                  <span className="qr-detail-label">Reference No.</span>
                  <span className="qr-detail-val font-mono">{ACADEMIC_FACTS.refNumber}</span>
                </div>
                <div className="qr-detail-row">
                  <span className="qr-detail-label">Security Token</span>
                  <span className="qr-detail-val font-mono text-cyan">{ACADEMIC_FACTS.verificationCode}</span>
                </div>
              </div>

              <div className="qr-modal-actions">
                <button
                  type="button"
                  className="academic-modal-btn primary"
                  onClick={() => {
                    setShowQrModal(false);
                    onOpenLightbox("certificate");
                  }}
                >
                  Inspect Certificate & QR in Lightbox
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export const DetailsPanel: React.FC<SubPanelProps> = (props) => {
  return (
    <>
      <TranscriptPanel {...props} />
      <FactsPanel {...props} />
    </>
  );
};

export default DetailsPanel;
