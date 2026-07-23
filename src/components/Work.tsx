import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ProjectItem {
  number: string;
  title: string;
  category: string;
  tools: string[];
  image: string;
  github: string;
}

const projects: ProjectItem[] = [
  {
    number: "01",
    title: "Hospital Management System",
    category: "Full Stack (IIT Guwahati)",
    tools: ["React.js", "Node.js", "Express", "MongoDB", "REST APIs"],
    image: "/images/hmis.png",
    github: "https://github.com/ANANTYASH11/Capstone-Project-IITGCS_24061332",
  },
  {
    number: "02",
    title: "DeepFake Forensic Analyzer",
    category: "AI / Computer Vision",
    tools: ["Python", "CNN", "TensorFlow", "OpenCV", "PyTorch"],
    image: "/images/deepfake.png",
    github: "https://github.com/ANANTYASH11/deepfake",
  },
  {
    number: "03",
    title: "Dynamic Load Balancer",
    category: "Systems & Networking",
    tools: ["C / C++", "POSIX Sockets", "Multithreading", "Linux"],
    image: "/images/loadbalancer.png",
    github: "https://github.com/ANANTYASH11/DYNAMIC_LOAD_BALANCER_LPU",
  },
  {
    number: "04",
    title: "Karo Pitch Platform",
    category: "Full Stack Startup App",
    tools: ["React.js", "Node.js", "Express", "MongoDB", "Tailwind"],
    image: "/images/karopitch.png",
    github: "https://github.com/ANANTYASH11/karo-pitch",
  },
];

const Work = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const flexRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <div className="work-section" id="work" ref={sectionRef}>
      <div className="work-container section-container">
        <div className="work-header">
          <div>
            <h2>
              My <span>Work</span>
            </h2>
            <p className="work-subtitle">Selected Projects & Research</p>
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
            <div className="work-box" key={index}>
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
              <WorkImage
                image={project.image}
                alt={project.title}
                link={project.github}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
