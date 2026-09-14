import { useState, useEffect, useRef } from "react";
import {
  MdSchool,
  MdZoomIn,
  MdDownload,
  MdClose,
  MdOutlineDescription,
  MdCheckCircle,
} from "react-icons/md";
import {
  FiExternalLink,
  FiShield,
  FiZap,
  FiCpu,
  FiLayers,
  FiArrowUpRight,
} from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/MinorDegree.css";

gsap.registerPlugin(ScrollTrigger);

const MinorDegree = () => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState<"certificate" | "transcript">("certificate");
  const sectionRef = useRef<HTMLElement>(null);

  const certificateImg = "/images/minor-degree.png";
  const transcriptImg = "/images/minor-degree-transcript.png";
  const officialPdfPath = "/docs/Anant_Yash_ReportCard.pdf";

  const currentDisplayImg = activeDoc === "certificate" ? certificateImg : transcriptImg;

  // Keyboard accessibility for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      }
    };
    if (isLightboxOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen]);

  // Professional GSAP Scroll Animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Subtitle Smooth Entrance
      gsap.fromTo(
        ".academics-subtitle",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".academics-header",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // 2. Certificate Showcase Card (Left Column) Entrance
      gsap.fromTo(
        ".degree-showcase-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".academics-grid",
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );

      // 3. Document Inner Frame Scale Reveal
      gsap.fromTo(
        ".degree-image-in",
        { opacity: 0, scale: 0.96 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".degree-showcase-card",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // 4. Credential Metadata Strip Item Stagger
      gsap.fromTo(
        ".credential-meta-item",
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.35,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".degree-showcase-card",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // 5. Right Column - Courses Summary Card Entrance
      gsap.fromTo(
        ".courses-summary-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".academics-grid",
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );

      // 6. Course Rows Stagger Entrance (Exact match to cinema scenes)
      gsap.fromTo(
        ".course-scene",
        { opacity: 0, x: 24 },
        {
          opacity: 1,
          x: 0,
          duration: 0.55,
          stagger: 0.08,
          delay: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".courses-summary-card",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // 7. Capstone Featured Project Card Entrance
      gsap.fromTo(
        ".capstone-featured-box",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          delay: 0.25,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".capstone-featured-box",
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );

      // 8. Engineering Standards Grid Sequential Stagger
      gsap.fromTo(
        ".matrix-box",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".engineering-matrix-wrap",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="academics-section section-container" id="academics" ref={sectionRef}>
      <div className="academics-container">
        {/* Section Header - Perfectly aligned with Selected Work & Career */}
        <div className="academics-header">
          <div>
            <h2 className="title">
              Academic <span>Foundation</span>
            </h2>
            <p className="academics-subtitle">
              Formal Computer Science credentials from IIT Guwahati & engineering production standards.
            </p>
          </div>
        </div>

        {/* Main Grid: Certificate Showcase on Left, Academic Transcript & Capstone on Right */}
        <div className="academics-grid">
          {/* Left: Certificate Showcase Card */}
          <div className="work-box degree-showcase-card">
            <div className="degree-card-header">
              <div className="work-title">
                <div>
                  <h4>IIT Guwahati</h4>
                  <p>Credit Linked CS Domain</p>
                </div>
                <span className="work-tag verified-pill">
                  <MdCheckCircle className="verified-check-icon" />
                  Verified Credential
                </span>
              </div>

              {/* Document Switcher Tabs */}
              <div className="document-tabs">
                <button
                  className={`document-tab ${activeDoc === "certificate" ? "active" : ""}`}
                  onClick={() => setActiveDoc("certificate")}
                  data-cursor="disable"
                >
                  <MdOutlineDescription />
                  <span>Certificate</span>
                </button>
                <button
                  className={`document-tab ${activeDoc === "transcript" ? "active" : ""}`}
                  onClick={() => setActiveDoc("transcript")}
                  data-cursor="disable"
                >
                  <MdCheckCircle />
                  <span>Transcript</span>
                </button>
              </div>
            </div>

            {/* Certificate Image Frame */}
            <div
              className="degree-image-in"
              onClick={() => setIsLightboxOpen(true)}
              title="Click to inspect document in full resolution"
              data-cursor="disable"
            >
              <img
                src={currentDisplayImg}
                alt={
                  activeDoc === "certificate"
                    ? "IIT Guwahati Credit Linked Computer Science Certificate - Anant Yash"
                    : "IIT Guwahati Course-wise Grade Transcript - Anant Yash"
                }
                className="degree-img"
              />
              <button
                className="work-link degree-inspect-link"
                title="Inspect Fullscreen"
                aria-label="Inspect Fullscreen"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                data-cursor="disable"
              >
                <MdZoomIn />
              </button>
            </div>

            {/* Credential Metadata Strip */}
            <div className="credential-meta-strip">
              <div className="credential-meta-item">
                <span className="scene-num">ID</span>
                <span className="meta-text">IITGCS_24061332</span>
              </div>
              <div className="credential-meta-item">
                <span className="scene-num">REF</span>
                <span className="meta-text">DG/IITG/CSE/2024-2025/C0232</span>
              </div>
              <div className="credential-meta-item">
                <span className="scene-num">VERIFY</span>
                <span className="meta-text">MJkSD9GbtW</span>
              </div>
            </div>

            {/* Card Information & Action Buttons */}
            <div className="degree-card-footer">
              <div className="degree-inst-row">
                <MdSchool className="degree-seal-icon" />
                <div className="degree-inst-text">
                  <h5>Daksh Gurukul · Indian Institute of Technology Guwahati</h5>
                  <p>Awarded to <strong>Anant Yash</strong> · Joint Initiative with NSDC (MSDE, Govt. of India)</p>
                </div>
              </div>

              <div className="degree-buttons-row">
                <button
                  className="academic-btn primary"
                  onClick={() => setIsLightboxOpen(true)}
                  data-cursor="disable"
                >
                  <MdZoomIn style={{ fontSize: "16px" }} />
                  <span>Full-Screen Lightbox</span>
                </button>
                <a
                  href={officialPdfPath}
                  download="Anant_Yash_IIT_Guwahati_CS_ReportCard.pdf"
                  className="academic-btn secondary"
                  data-cursor="disable"
                >
                  <MdDownload style={{ fontSize: "16px" }} />
                  <span>Official PDF</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Academic Coursework Transcript & Capstone Spotlight */}
          <div className="academics-right-col">
            {/* 6-Course Academic Transcript List */}
            <div className="work-box courses-summary-card">
              <div className="work-info">
                <h4>Curriculum Transcript · Completed (6 / 6)</h4>
              </div>

              <div className="courses-list-flex">
                <div className="cinema-scene course-scene">
                  <div className="scene-header">
                    <span className="scene-num">MTH 101</span>
                    <span className="scene-title">Mathematics for Computer Science</span>
                    <span className="course-status-pill">Completed</span>
                  </div>
                  <p className="course-scene-desc">
                    Discrete mathematics, graph theory, combinatorics & mathematical logic proofs.
                  </p>
                </div>

                <div className="cinema-scene course-scene">
                  <div className="scene-header">
                    <span className="scene-num">CSE 101</span>
                    <span className="scene-title">Intro to Computer Science & Programming</span>
                    <span className="course-status-pill">Completed</span>
                  </div>
                  <p className="course-scene-desc">
                    Algorithmic paradigms, memory addressing, recursion & pointers.
                  </p>
                </div>

                <div className="cinema-scene course-scene">
                  <div className="scene-header">
                    <span className="scene-num">CSE 201</span>
                    <span className="scene-title">Data Structures and Algorithms</span>
                    <span className="course-status-pill">Completed</span>
                  </div>
                  <p className="course-scene-desc">
                    Asymptotic Big-O, dynamic programming, trees, balanced graphs & sorting.
                  </p>
                </div>

                <div className="cinema-scene course-scene">
                  <div className="scene-header">
                    <span className="scene-num">CSE 202</span>
                    <span className="scene-title">Database Systems</span>
                    <span className="course-status-pill">Completed</span>
                  </div>
                  <p className="course-scene-desc">
                    Relational algebra, SQL, ACID transactions, normalization & index design.
                  </p>
                </div>

                <div className="cinema-scene course-scene">
                  <div className="scene-header">
                    <span className="scene-num">CSE 301</span>
                    <span className="scene-title">Computer System Design & Architecture</span>
                    <span className="course-status-pill">Completed</span>
                  </div>
                  <p className="course-scene-desc">
                    Hardware-software interface, memory hierarchy, cache coherency & OS threads.
                  </p>
                </div>

                <div className="cinema-scene course-scene capstone-scene">
                  <div className="scene-header">
                    <span className="scene-num capstone-num">CSE 302</span>
                    <span className="scene-title">Capstone Project (HMIS)</span>
                    <span className="course-status-pill verified">Completed</span>
                  </div>
                  <p className="course-scene-desc">
                    Hospital Management Information System developed under IIT Guwahati CS faculty.
                  </p>
                </div>
              </div>
            </div>

            {/* Featured IITG Capstone Project Card */}
            <div className="work-box capstone-featured-box">
              <div className="work-title">
                <div>
                  <h4>Hospital Management System</h4>
                  <p>IIT Guwahati Capstone · CSE 302</p>
                </div>
                <a
                  href="https://github.com/ANANTYASH11/Capstone-Project-IITGCS_24061332"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="work-link"
                  title="Inspect Capstone on GitHub"
                  data-cursor="disable"
                >
                  <FiArrowUpRight />
                </a>
              </div>
              <p className="capstone-description">
                Enterprise clinical management application engineered under IIT Guwahati CS faculty guidance (Dr. Gaurav Trivedi & Dr. Aryabartta Sahu). Features role-based access control, encrypted patient records, real-time appointment scheduling, and ACID database integrity.
              </p>
              <div className="work-tags">
                <span className="work-tag">React.js</span>
                <span className="work-tag">Node.js</span>
                <span className="work-tag">PostgreSQL</span>
                <span className="work-tag">ACID Transactions</span>
                <span className="work-tag">RBAC Security</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Stack Developer Engineering Standards Matrix */}
        <div className="engineering-matrix-wrap">
          <div className="academics-header matrix-sub-header">
            <div>
              <div className="section-eyebrow">Production Benchmarks</div>
              <h3 className="matrix-title">
                Engineering <span>Standards</span>
              </h3>
              <p className="academics-subtitle">
                Architectural benchmarks, production thresholds, and system reliability practices.
              </p>
            </div>
          </div>

          <div className="matrix-cards-grid">
            <div className="work-box matrix-box">
              <div className="matrix-icon-box">
                <FiZap />
              </div>
              <div className="matrix-content">
                <h4>High Performance UI</h4>
                <p>
                  React 18, Next.js App Router, SSR hydration & Three.js 60FPS fluid interactivity.
                </p>
                <div className="work-tags">
                  <span className="work-tag">95+ Lighthouse</span>
                </div>
              </div>
            </div>

            <div className="work-box matrix-box">
              <div className="matrix-icon-box">
                <FiShield />
              </div>
              <div className="matrix-content">
                <h4>Enterprise Security</h4>
                <p>
                  OWASP compliance, JWT & OAuth2, strict RBAC, encrypted payload transit & sanitization.
                </p>
                <div className="work-tags">
                  <span className="work-tag">OWASP Top 10</span>
                </div>
              </div>
            </div>

            <div className="work-box matrix-box">
              <div className="matrix-icon-box">
                <FiCpu />
              </div>
              <div className="matrix-content">
                <h4>Cloud & DevOps</h4>
                <p>
                  Docker microservices containerization, CI/CD automated GitHub pipelines & OCI cloud.
                </p>
                <div className="work-tags">
                  <span className="work-tag">Docker · CI/CD · OCI</span>
                </div>
              </div>
            </div>

            <div className="work-box matrix-box">
              <div className="matrix-icon-box">
                <FiLayers />
              </div>
              <div className="matrix-content">
                <h4>AI & Vector Pipelines</h4>
                <p>
                  Deep learning, PyTorch/TensorFlow vision models, LangChain workflows & embeddings.
                </p>
                <div className="work-tags">
                  <span className="work-tag">LLMs · PyTorch · Vision</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for High-Resolution Document Inspection */}
      {isLightboxOpen && (
        <div
          className="degree-lightbox-overlay"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="degree-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="degree-lightbox-header">
              <div className="lightbox-title-box">
                <h4>
                  IIT Guwahati — {activeDoc === "certificate" ? "Certificate of Completion" : "Official Course Transcript"}
                </h4>
                <span className="lightbox-doc-ref">Ref: DG/IITG/CSE/2024-2025/C0232 · Code: IITGCS_24061332</span>
              </div>

              {/* Lightbox Tab Switcher */}
              <div className="lightbox-controls">
                <div className="document-tabs">
                  <button
                    className={`document-tab ${activeDoc === "certificate" ? "active" : ""}`}
                    onClick={() => setActiveDoc("certificate")}
                    data-cursor="disable"
                  >
                    Page 1: Certificate
                  </button>
                  <button
                    className={`document-tab ${activeDoc === "transcript" ? "active" : ""}`}
                    onClick={() => setActiveDoc("transcript")}
                    data-cursor="disable"
                  >
                    Page 2: Transcript
                  </button>
                </div>
                <button
                  className="work-arrow-btn lightbox-close-btn"
                  onClick={() => setIsLightboxOpen(false)}
                  aria-label="Close Preview"
                  data-cursor="disable"
                >
                  <MdClose />
                </button>
              </div>
            </div>

            <div className="degree-lightbox-img-box">
              <img
                src={currentDisplayImg}
                alt={
                  activeDoc === "certificate"
                    ? "IIT Guwahati Minor Degree Certificate"
                    : "IIT Guwahati Transcript Summary"
                }
                className="degree-lightbox-img"
              />
            </div>

            <div className="degree-lightbox-footer">
              <span>Candidate: <strong>Anant Yash</strong> (IITGCS_24061332)</span>
              <div className="lightbox-footer-actions">
                <a
                  href={currentDisplayImg}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="academic-btn secondary"
                  data-cursor="disable"
                >
                  <FiExternalLink style={{ fontSize: "15px" }} />
                  <span>Open Image</span>
                </a>
                <a
                  href={officialPdfPath}
                  download="Anant_Yash_IIT_Guwahati_CS_ReportCard.pdf"
                  className="academic-btn primary"
                  data-cursor="disable"
                >
                  <MdDownload style={{ fontSize: "16px" }} />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MinorDegree;
