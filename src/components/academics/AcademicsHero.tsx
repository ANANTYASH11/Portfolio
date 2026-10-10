import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiChevronDown } from "react-icons/fi";
import { ACADEMICS_CONFIG } from "./academicsConfig";
import HeroCertificate from "./HeroCertificate";
import StatRail from "./StatRail";
import CurriculumRail from "./CurriculumRail";
import CertificateBackdrop from "./CertificateBackdrop";
import SupportStrip from "./SupportStrip";
import CursorRing from "./CursorRing";
import { TranscriptPanel, FactsPanel } from "./DetailsPanel";
import CertLightbox from "./CertLightbox";
import "../styles/AcademicsHero.css";

gsap.registerPlugin(ScrollTrigger);

export const AcademicsHero: React.FC = () => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxDoc, setLightboxDoc] = useState<"certificate" | "transcript">("certificate");
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);
  const [isCertGlowActive, setIsCertGlowActive] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const certContainerRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      // Entrance timeline: rails slide 24px inward toward center
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          toggleActions: "play none none none",
        },
      });

      entranceTl.fromTo(
        ".academics-stat-rail",
        { opacity: 0, x: -ACADEMICS_CONFIG.railSlideDistance },
        {
          opacity: 1,
          x: 0,
          duration: ACADEMICS_CONFIG.entranceDuration,
          ease: ACADEMICS_CONFIG.entranceEase,
        },
        0
      );

      entranceTl.fromTo(
        ".academics-curriculum-rail",
        { opacity: 0, x: ACADEMICS_CONFIG.railSlideDistance },
        {
          opacity: 1,
          x: 0,
          duration: ACADEMICS_CONFIG.entranceDuration,
          ease: ACADEMICS_CONFIG.entranceEase,
        },
        0
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleToggleDetails = () => {
    setIsDetailsOpen((prev) => !prev);
  };

  const handleOpenLightbox = (
    doc: "certificate" | "transcript" = "certificate"
  ) => {
    setLightboxDoc(doc);
    setTriggerElement(document.activeElement as HTMLElement);
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
  };

  return (
    <section
      ref={sectionRef}
      id="academics"
      className="academics-hero-section academics-composed-stage"
      aria-label="Academics Foundation · IIT Guwahati CS Minor Degree"
    >
      {/* ─── 10px -> 36px "EXAMINE" Ring Cursor (Suppresses global orb) ─── */}
      <CursorRing sectionRef={sectionRef} />

      <div className="academics-hero-inner">
        {/* ─── Top Eyebrow, Heading & Subtitle (Tight 48px gap to stage) ─── */}
        <header className="academics-hero-header">
          <p className="academics-hero-eyebrow">
            <span>ACADEMIC FOUNDATION · 6 / 6 COURSES</span>
          </p>
          <h2 className="academics-hero-heading">
            <em>IIT Guwahati</em> certified.
          </h2>
          <p className="academics-hero-subtitle">
            A credit-linked Computer Science programme with Daksh Gurukul, IIT Guwahati.
          </p>
        </header>

        {/* ─── 3-Column Stage Composition (Left Rail | Center Hero | Right Rail) ─── */}
        <div className="academics-three-column-stage">
          {/* Column 1: Left Rail "AT A GLANCE" */}
          <StatRail />

          {/* Column 2: Center Hero Certificate with Depth Backdrop */}
          <div className="academics-stage-center-anchor">
            <CertificateBackdrop />
            <HeroCertificate
              isDetailsOpen={isDetailsOpen}
              onOpenLightbox={handleOpenLightbox}
              containerRef={certContainerRef}
              isGlowActive={isCertGlowActive}
            />
          </div>

          {/* Column 3: Right Rail "THE CURRICULUM" */}
          <CurriculumRail
            onHoverCourse={(idx) => setIsCertGlowActive(idx !== null)}
          />
        </div>

        {/* ─── Unfolded Detailed Drawer (Revealed smoothly on demand) ─── */}
        {isDetailsOpen && (
          <div className="academics-unfold-drawer">
            <TranscriptPanel
              isOpen={isDetailsOpen}
              onOpenLightbox={handleOpenLightbox}
            />
            <FactsPanel
              isOpen={isDetailsOpen}
              onOpenLightbox={handleOpenLightbox}
            />
          </div>
        )}

        {/* ─── Support Strip & Toggle Details Button ─── */}
        <footer className="academics-hero-footer">
          <SupportStrip />

          <button
            ref={toggleBtnRef}
            type="button"
            className="academics-view-details-btn"
            onClick={handleToggleDetails}
            aria-expanded={isDetailsOpen}
            aria-controls="academics-transcript-panel academics-facts-panel"
          >
            <span>{isDetailsOpen ? "Hide details" : "View details"}</span>
            <FiChevronDown
              className={`chevron-icon ${isDetailsOpen ? "is-flipped" : ""}`}
              aria-hidden="true"
            />
          </button>
        </footer>
      </div>

      {/* ─── High-Resolution Lightbox Modal (GSAP Flip) ─── */}
      <CertLightbox
        isOpen={isLightboxOpen}
        initialDoc={lightboxDoc}
        onClose={handleCloseLightbox}
        triggerElement={triggerElement}
      />
    </section>
  );
};

export default AcademicsHero;
