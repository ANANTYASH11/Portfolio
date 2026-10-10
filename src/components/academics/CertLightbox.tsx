import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import {
  MdClose,
  MdZoomIn,
  MdZoomOut,
  MdRefresh,
  MdDownload,
} from "react-icons/md";
import { FiExternalLink, FiShield } from "react-icons/fi";
import { ACADEMICS_CONFIG, ACADEMIC_FACTS } from "./academicsConfig";

gsap.registerPlugin(Flip);

interface CertLightboxProps {
  isOpen: boolean;
  initialDoc?: "certificate" | "transcript";
  onClose: () => void;
  triggerElement?: HTMLElement | null;
}

export const CertLightbox: React.FC<CertLightboxProps> = ({
  isOpen,
  initialDoc = "certificate",
  onClose,
  triggerElement,
}) => {
  const [activeDoc, setActiveDoc] = useState<"certificate" | "transcript">(initialDoc);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [panPos, setPanPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const modalRef = useRef<HTMLDivElement>(null);
  const imgBoxRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchStartDist = useRef<number | null>(null);

  // Sync active document when modal opens with initialDoc
  useEffect(() => {
    if (isOpen) {
      setActiveDoc(initialDoc);
      setZoomLevel(1.0);
      setPanPos({ x: 0, y: 0 });
    }
  }, [isOpen, initialDoc]);

  // Handle ESC key and Trap Focus
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap logic
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
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

    // Initial focus on close button or modal container
    const timer = setTimeout(() => {
      const closeBtn = modalRef.current?.querySelector<HTMLElement>(".lightbox-close-btn");
      closeBtn?.focus();
    }, 50);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
      // Return focus to trigger element
      if (triggerElement && typeof triggerElement.focus === "function") {
        triggerElement.focus();
      }
    };
  }, [isOpen, onClose, triggerElement]);

  // GSAP Flip transition on modal open
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const cardEl = document.getElementById("hero-certificate-card");
    const overlayEl = modalRef.current;

    if (cardEl && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const state = Flip.getState([cardEl]);
      // Animate overlay entrance smoothly
      gsap.fromTo(
        overlayEl,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: "power2.out" }
      );
      Flip.from(state, {
        duration: 0.5,
        ease: "power3.inOut",
        scale: true,
      });
    } else {
      gsap.fromTo(
        overlayEl,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power2.out" }
      );
    }
  }, [isOpen]);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) =>
      Math.min(prev + ACADEMICS_CONFIG.lightboxZoomStep, ACADEMICS_CONFIG.lightboxZoomMax)
    );
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => {
      const next = Math.max(
        prev - ACADEMICS_CONFIG.lightboxZoomStep,
        ACADEMICS_CONFIG.lightboxZoomMin
      );
      if (next === 1) setPanPos({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomLevel(1.0);
    setPanPos({ x: 0, y: 0 });
  }, []);

  // Pan / Drag handlers when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1.0) return;
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1.0) return;
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setPanPos((prev) => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Pinch-to-zoom on Mobile
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );

      if (touchStartDist.current !== null) {
        const factor = dist / touchStartDist.current;
        setZoomLevel((prev) =>
          Math.min(Math.max(prev * (factor > 1 ? 1.02 : 0.98), 1.0), 3.0)
        );
      }
      touchStartDist.current = dist;
    }
  };

  const handleTouchEnd = () => {
    touchStartDist.current = null;
  };

  if (!isOpen) return null;

  const currentDisplayImg =
    activeDoc === "certificate"
      ? ACADEMIC_FACTS.certificateImg
      : ACADEMIC_FACTS.transcriptImg;

  const currentWebpImg =
    activeDoc === "certificate"
      ? "/images/minor-degree.webp"
      : "/images/minor-degree-transcript.webp";

  return createPortal(
    <div
      ref={modalRef}
      className="cert-lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="High-resolution IIT Guwahati document viewer"
    >
      <div
        className="cert-lightbox-container glass-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Lightbox Top Header Bar */}
        <div className="lightbox-header-bar">
          <div className="lightbox-header-info">
            <div className="lightbox-badge">
              <FiShield className="shield-icon" aria-hidden="true" />
              <span>IIT GUWAHATI · OFFICIAL CREDENTIAL</span>
            </div>
            <h4 className="lightbox-title">
              {activeDoc === "certificate"
                ? "Certificate of Completion — Minor in Computer Science & Engineering"
                : "Official Academic Transcript — Computer Science & Engineering Curriculum"}
            </h4>
            <div className="lightbox-meta-row">
              <span>Candidate: <strong>{ACADEMIC_FACTS.candidateName}</strong></span>
              <span className="meta-sep">·</span>
              <span>ID: <code className="mono-code">{ACADEMIC_FACTS.studentId}</code></span>
              <span className="meta-sep">·</span>
              <span>Ref: <code className="mono-code">{ACADEMIC_FACTS.refNumber}</code></span>
            </div>
          </div>

          {/* Lightbox Navigation Controls */}
          <div className="lightbox-header-actions">
            {/* Document Switcher Tabs */}
            <div className="lightbox-doc-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeDoc === "certificate"}
                className={`lightbox-tab ${
                  activeDoc === "certificate" ? "active" : ""
                }`}
                onClick={() => {
                  setActiveDoc("certificate");
                  handleResetZoom();
                }}
                data-cursor="pointer"
              >
                Page 1: Certificate
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeDoc === "transcript"}
                className={`lightbox-tab ${
                  activeDoc === "transcript" ? "active" : ""
                }`}
                onClick={() => {
                  setActiveDoc("transcript");
                  handleResetZoom();
                }}
                data-cursor="pointer"
              >
                Page 2: Transcript
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="lightbox-zoom-bar" aria-label="Zoom controls">
              <button
                type="button"
                className="zoom-btn"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1.0}
                aria-label="Zoom out"
                data-cursor="pointer"
              >
                <MdZoomOut />
              </button>
              <span className="zoom-indicator">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                className="zoom-btn"
                onClick={handleZoomIn}
                disabled={zoomLevel >= ACADEMICS_CONFIG.lightboxZoomMax}
                aria-label="Zoom in"
                data-cursor="pointer"
              >
                <MdZoomIn />
              </button>
              <button
                type="button"
                className="zoom-btn reset"
                onClick={handleResetZoom}
                aria-label="Reset zoom"
                data-cursor="pointer"
                title="Reset zoom"
              >
                <MdRefresh />
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={onClose}
              aria-label="Close document viewer"
              data-cursor="pointer"
            >
              <MdClose />
            </button>
          </div>
        </div>

        {/* Lightbox Viewport & Drag Canvas */}
        <div
          ref={imgBoxRef}
          className={`lightbox-img-viewport ${zoomLevel > 1 ? "is-zoomed" : ""}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="lightbox-img-canvas"
            style={{
              transform: `scale(${zoomLevel}) translate(${panPos.x / zoomLevel}px, ${panPos.y / zoomLevel}px)`,
              cursor: zoomLevel > 1.0 ? (isDragging ? "grabbing" : "grab") : "default",
            }}
          >
            <picture>
              <source type="image/webp" srcSet={currentWebpImg} />
              <img
                src={currentDisplayImg}
                alt={
                  activeDoc === "certificate"
                    ? "Full Resolution IIT Guwahati Minor Degree Certificate awarded to Anant Yash"
                    : "Full Resolution IIT Guwahati Official Course Transcript Grade Sheet"
                }
                className="lightbox-rendered-doc"
                width={1730}
                height={1180}
                draggable={false}
              />
            </picture>
          </div>
        </div>

        {/* Lightbox Bottom Actions Bar */}
        <div className="lightbox-bottom-bar">
          <div className="lightbox-bottom-note">
            <span>
              Issued under Daksh Gurukul & NSDC (Govt. of India) · Verified
              Permanent Academic Record
            </span>
          </div>

          <div className="lightbox-bottom-actions">
            <a
              href={currentDisplayImg}
              target="_blank"
              rel="noopener noreferrer"
              className="academic-btn secondary"
              data-cursor="pointer"
            >
              <FiExternalLink />
              <span>Open Raw Image</span>
            </a>
            <a
              href={ACADEMIC_FACTS.pdfPath}
              download="Anant_Yash_IIT_Guwahati_CS_ReportCard.pdf"
              className="academic-btn primary"
              data-cursor="pointer"
            >
              <MdDownload />
              <span>Download Official PDF</span>
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CertLightbox;
