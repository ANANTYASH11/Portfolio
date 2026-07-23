import { useEffect, useRef } from "react";
import "./styles/Career.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GraduationCap = () => {
  return (
    <svg
      className="career-grad-cap"
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Mortar board base */}
      <polygon
        className="cap-board"
        points="100,20 200,60 100,100 0,60"
        fill="url(#capGradient)"
        stroke="rgba(170,66,255,0.8)"
        strokeWidth="2"
      />
      {/* Cap top surface with metallic look */}
      <polygon
        className="cap-top"
        points="100,15 195,55 100,95 5,55"
        fill="url(#capTopGradient)"
      />
      {/* Center button */}
      <circle
        className="cap-button"
        cx="100"
        cy="55"
        r="5"
        fill="#c481ff"
      />
      {/* Tassel string */}
      <path
        className="cap-tassel-string"
        d="M100,55 Q120,75 140,95"
        stroke="url(#tasselGradient)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Tassel end decoration */}
      <g className="cap-tassel-end">
        <rect
          x="135"
          y="90"
          width="12"
          height="18"
          rx="2"
          fill="url(#tasselEndGradient)"
        />
        {/* Tassel fringe lines */}
        <line x1="136" y1="108" x2="136" y2="125" stroke="#d29bff" strokeWidth="1.5" />
        <line x1="139" y1="108" x2="139" y2="128" stroke="#c481ff" strokeWidth="1.5" />
        <line x1="141" y1="108" x2="141" y2="123" stroke="#d29bff" strokeWidth="1.5" />
        <line x1="143" y1="108" x2="143" y2="127" stroke="#aa42ff" strokeWidth="1.5" />
        <line x1="145" y1="108" x2="145" y2="122" stroke="#d29bff" strokeWidth="1.5" />
      </g>

      {/* Glow circle behind the cap */}
      <circle
        className="cap-glow"
        cx="100"
        cy="55"
        r="50"
        fill="url(#glowGradient)"
        opacity="0.6"
      />

      {/* Gradients */}
      <defs>
        <linearGradient id="capGradient" x1="0" y1="0" x2="200" y2="100">
          <stop offset="0%" stopColor="#1a0a2e" />
          <stop offset="50%" stopColor="#3d1b6e" />
          <stop offset="100%" stopColor="#1a0a2e" />
        </linearGradient>
        <linearGradient id="capTopGradient" x1="0" y1="0" x2="200" y2="100">
          <stop offset="0%" stopColor="#2d1b4e" />
          <stop offset="30%" stopColor="#4a287a" />
          <stop offset="70%" stopColor="#351859" />
          <stop offset="100%" stopColor="#1f0f38" />
        </linearGradient>
        <linearGradient id="tasselGradient" x1="100" y1="55" x2="140" y2="95">
          <stop offset="0%" stopColor="#c481ff" />
          <stop offset="100%" stopColor="#aa42ff" />
        </linearGradient>
        <linearGradient id="tasselEndGradient" x1="135" y1="90" x2="147" y2="108">
          <stop offset="0%" stopColor="#aa42ff" />
          <stop offset="100%" stopColor="#7f40ff" />
        </linearGradient>
        <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c481ff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#c481ff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
};

/* Floating particle component for the sparkle effect */
const FloatingParticles = () => {
  return (
    <div className="career-particles">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="career-particle"
          style={{
            left: `${10 + (i * 6) + Math.random() * 5}%`,
            top: `${10 + Math.random() * 80}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 3}s`,
            width: `${3 + Math.random() * 4}px`,
            height: `${3 + Math.random() * 4}px`,
          }}
        />
      ))}
    </div>
  );
};

const Career = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Graduation cap entrance animation
      gsap.fromTo(
        ".career-grad-cap",
        { scale: 0.5, rotation: -20, opacity: 0, y: 30 },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".career-header",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Tassel gentle sway animation (continuous)
      gsap.to(".cap-tassel-string", {
        attr: { d: "M100,55 Q125,80 145,100" },
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".cap-tassel-end", {
        x: 5,
        y: 5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Glow pulse
      gsap.to(".cap-glow", {
        opacity: 0.8,
        scale: 1.15,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Career info boxes stagger in with slide
      gsap.fromTo(
        ".career-info-box",
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".career-info",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="career-section section-container" id="career" ref={sectionRef}>
      <div className="career-container">
        <div className="career-header">
          <GraduationCap />
          <h2>
            My career <span>&</span>
            <br /> experience
          </h2>
          <FloatingParticles />
        </div>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Software Engineering Intern</h4>
                <h5>Bluestock Fintech</h5>
              </div>
              <div className="career-year-badge">
                <h3>2025</h3>
              </div>
            </div>
            <p>
              Developed transaction intelligence modules for fintech payment infrastructure handling high-volume digital transactions. Designed analytics pipelines to detect anomalous payment patterns and improve fraud monitoring.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Software Engineering Intern</h4>
                <h5>Infosys Springboard</h5>
              </div>
              <div className="career-year-badge">
                <h3>2025</h3>
              </div>
            </div>
            <p>
              Built machine learning models for predictive analytics on financial datasets and improved capability for transaction risk detection using data-driven analysis.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>AI Youth Fellow</h4>
                <h5>1M1B (1 Million by 1 Billion)</h5>
              </div>
              <div className="career-year-badge">
                <h3>2025</h3>
              </div>
            </div>
            <p>
              Collaborated on social impact projects under the 1M1B initiative to address real-world community challenges, contributing to scalable solutions and digital innovation.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Oracle Certified Professional</h4>
                <h5>Cloud, AI, DevOps & Systems</h5>
              </div>
              <div className="career-year-badge">
                <h3>OCI</h3>
              </div>
            </div>
            <div className="career-certs-container">
              <div className="career-cert-item">
                <span className="career-cert-name">Oracle Certified Networking Professional</span>
                <span className="career-cert-issuer">Oracle Corporation</span>
              </div>
              <div className="career-cert-item">
                <span className="career-cert-name">Oracle Generative AI Certified Professional</span>
                <span className="career-cert-issuer">Oracle Corporation</span>
              </div>
              <div className="career-cert-item">
                <span className="career-cert-name">Oracle Certified DevOps Professional</span>
                <span className="career-cert-issuer">Oracle Corporation</span>
              </div>
              <div className="career-cert-item">
                <span className="career-cert-name">Oracle Certified Cloudbase Professional</span>
                <span className="career-cert-issuer">Oracle Corporation</span>
              </div>
              <div className="career-cert-item">
                <span className="career-cert-name">Oracle Cloud Infrastructure Data Science Professional</span>
                <span className="career-cert-issuer">Oracle Corporation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
