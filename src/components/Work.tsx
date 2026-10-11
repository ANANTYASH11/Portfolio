import "./styles/Work.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { useRef, useState, useCallback, useEffect } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { FiArrowUpRight, FiExternalLink } from "react-icons/fi";
import { projects, ProjectData } from "../data/projects";
import CaseStudyPanel from "./CaseStudyPanel";

gsap.registerPlugin(ScrollTrigger, Flip, useGSAP);

const Work = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const flexRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);

  // Desktop horizontal pin scroll trigger
  useGSAP(
    () => {
      if (window.innerWidth <= 1024) return;

      const flex = flexRef.current;
      if (!flex) return;

      const container = flex.closest(".work-container") as HTMLElement;
      if (!container) return;

      const getMaxTranslate = () => {
        return flex.scrollWidth - container.clientWidth;
      };

      const pinTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${getMaxTranslate() * 0.65}`,
          scrub: 0.1,
          pin: true,
          invalidateOnRefresh: true,
          id: "work-pin",
          onUpdate: (self) => {
            const progress = self.progress;
            const idx = Math.min(
              projects.length - 1,
              Math.round(progress * (projects.length - 1))
            );
            setCurrentIndex(idx);
          },
        },
      });

      pinTimeline.to(flex, {
        x: () => -getMaxTranslate(),
        ease: "none",
      });
    },
    { scope: sectionRef }
  );

  // Prevent background scrolling when case study modal is expanded
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  const goToProject = (index: number) => {
    const newIndex = Math.max(0, Math.min(projects.length - 1, index));

    if (window.innerWidth <= 1024) {
      setCurrentIndex(newIndex);
      if (flexRef.current && flexRef.current.children[newIndex]) {
        flexRef.current.children[newIndex].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    const st = ScrollTrigger.getById("work-pin");
    if (st) {
      const start = st.start;
      const end = st.end;
      const targetScroll = start + (newIndex / (projects.length - 1)) * (end - start);
      gsap.to(st, {
        scroll: targetScroll,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  // Open Case Study with GSAP Flip expand
  const openCaseStudy = useCallback((project: ProjectData, cardEl: HTMLDivElement | null) => {
    if (!cardEl) return;
    setTriggerEl(cardEl);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setSelectedProject(project);
      requestAnimationFrame(() => {
        const backdrop = document.querySelector(".case-study-backdrop") as HTMLElement;
        if (backdrop) backdrop.style.opacity = "1";
      });
      return;
    }

    // Capture spatial state before DOM expansion
    const state = Flip.getState(cardEl);
    setSelectedProject(project);

    requestAnimationFrame(() => {
      const panel = document.getElementById("case-study-panel");
      const backdrop = document.querySelector(".case-study-backdrop") as HTMLElement;
      if (backdrop) {
        gsap.to(backdrop, { opacity: 1, duration: 0.35, ease: "power2.out" });
      }
      if (panel) {
        Flip.from(state, {
          targets: panel,
          duration: 0.48,
          ease: "power2.out",
          scale: true,
          prune: true,
        });
      }
    });
  }, []);

  // Close Case Study with GSAP Flip collapse & focus return
  const closeCaseStudy = useCallback(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const panel = document.getElementById("case-study-panel");
    const backdrop = document.querySelector(".case-study-backdrop") as HTMLElement;
    const currentTrigger = triggerEl;

    if (!prefersReducedMotion && panel && currentTrigger) {
      const state = Flip.getState(panel);
      gsap.to(backdrop, {
        opacity: 0,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          setSelectedProject(null);
          requestAnimationFrame(() => {
            Flip.from(state, {
              targets: currentTrigger,
              duration: 0.38,
              ease: "power2.inOut",
              scale: true,
              onComplete: () => {
                currentTrigger.focus();
              },
            });
          });
        },
      });
    } else {
      if (backdrop) backdrop.style.opacity = "0";
      setSelectedProject(null);
      currentTrigger?.focus();
    }
  }, [triggerEl]);

  return (
    <div className="work-section" id="work" ref={sectionRef}>
      <div className="work-container section-container">
        <div className="work-header">
          <div>
            <h2>
              My <span>Work</span>
            </h2>
            <p className="work-subtitle">
              Selected Systems, AI & Full-Stack Projects · Click any project to open Case Study
            </p>
          </div>
          <div className="work-controls">
            <button
              className="work-arrow-btn"
              onClick={() => goToProject(currentIndex - 1)}
              disabled={currentIndex === 0}
              aria-label="Previous Project"
            >
              <BsArrowLeft />
            </button>
            <span className="work-counter">
              0{currentIndex + 1} / 0{projects.length}
            </span>
            <button
              className="work-arrow-btn"
              onClick={() => goToProject(currentIndex + 1)}
              disabled={currentIndex === projects.length - 1}
              aria-label="Next Project"
            >
              <BsArrowRight />
            </button>
          </div>
        </div>

        <div className="work-flex" ref={flexRef}>
          {projects.map((project, index) => (
            <div
              className="work-box"
              key={project.id}
              ref={(el) => {
                cardRefs.current[project.id] = el;
              }}
              tabIndex={0}
              role="button"
              aria-haspopup="dialog"
              aria-label={`Open case study for ${project.title}`}
              onClick={() => openCaseStudy(project, cardRefs.current[project.id])}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openCaseStudy(project, cardRefs.current[project.id]);
                }
              }}
            >
              <div className="work-info">
                <div className="work-title">
                  <h3>{project.number}</h3>
                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>

                <h4>Tools & Technologies</h4>
                <div className="work-tags">
                  {project.tools.map((tool, i) => (
                    <span key={i} className="work-tag">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Thumbnail */}
              <div className="work-image">
                <div className="work-image-in">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
              </div>

              {/* Footer with Case Study View Callout */}
              <div className="work-card-footer">
                <span className="work-case-study-trigger">
                  <span>Explore Case Study</span>
                  <FiArrowUpRight size={16} />
                </span>
                <div className="work-card-pills">
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="work-live-pill"
                      onClick={(e) => e.stopPropagation()}
                      title={`Open live project for ${project.title}`}
                    >
                      <span className="work-live-dot" />
                      <span>Live</span>
                      <FiExternalLink size={12} />
                    </a>
                  )}
                  <span className="work-verified-pill">
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#00f0ff",
                        boxShadow: "0 0 6px #00f0ff",
                        display: "inline-block",
                      }}
                    />
                    <span>Verified</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Case-Study Modal / Mobile Sheet */}
      {selectedProject && (
        <CaseStudyPanel
          project={selectedProject}
          onClose={closeCaseStudy}
          triggerElement={triggerEl}
        />
      )}
    </div>
  );
};

export default Work;
