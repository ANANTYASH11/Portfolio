import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TechChip, { TechChipData } from "./TechChip";

gsap.registerPlugin(ScrollTrigger);

export interface TechCardData {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  items: TechChipData[];
}

interface TechCardProps {
  card: TechCardData;
  hoveredTech: string | null;
  onHoverTech: (name: string | null) => void;
  maxTiltDeg?: number;
  perspective?: number;
  chipSpringStagger?: number;
  isFocused?: boolean;
  isDimmedByFilter?: boolean;
}

export const TechCard = ({
  card,
  hoveredTech,
  onHoverTech,
  maxTiltDeg = 6,
  perspective = 1000,
  chipSpringStagger = 0.04,
  isFocused = false,
  isDimmedByFilter = false,
}: TechCardProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const chipsContainerRef = useRef<HTMLDivElement | null>(null);
  const [displayCount, setDisplayCount] = useState(0);

  // gsap.quickTo smooth interpolators for 3D tilt
  const tiltX = useRef<((val: number) => void) | null>(null);
  const tiltY = useRef<((val: number) => void) | null>(null);

  useEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isTouch && !reducedMotion) {
      tiltX.current = gsap.quickTo(cardEl, "rotationX", {
        duration: 0.4,
        ease: "power2.out",
      });
      tiltY.current = gsap.quickTo(cardEl, "rotationY", {
        duration: 0.4,
        ease: "power2.out",
      });
    }

    // Number count-up and chips entrance
    const targetCount = card.items.length;
    const countObj = { val: 0 };

    const ctx = gsap.context(() => {
      // 1. Number Counter
      gsap.to(countObj, {
        val: targetCount,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardEl,
          start: "top 88%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          setDisplayCount(Math.round(countObj.val));
        },
      });

      // 2. Chips Spring Scale Entrance
      if (chipsContainerRef.current) {
        const chips = chipsContainerRef.current.children;
        gsap.fromTo(
          chips,
          {
            scale: 0.8,
            opacity: 0,
            y: 8,
          },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: chipSpringStagger,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: cardEl,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, cardEl);

    return () => {
      tiltX.current = null;
      tiltY.current = null;
      ctx.revert();
    };
  }, [card.items.length, chipSpringStagger]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Spotlight coordinates
    cardEl.style.setProperty("--mx", `${x}px`);
    cardEl.style.setProperty("--my", `${y}px`);

    // 3D Tilt calculation
    if (tiltX.current && tiltY.current) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotY = ((x - centerX) / centerX) * maxTiltDeg;
      const rotX = -((y - centerY) / centerY) * maxTiltDeg;

      tiltX.current(rotX);
      tiltY.current(rotY);
    }
  };

  const handleMouseLeave = () => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    if (tiltX.current && tiltY.current) {
      tiltX.current(0);
      tiltY.current(0);
    }
  };

  const CardIcon = card.icon;

  return (
    <div
      ref={cardRef}
      className={`tech-enchanted-card ${isFocused ? "focused-glow" : ""} ${
        isDimmedByFilter ? "filter-dimmed" : ""
      }`}
      style={
        {
          perspective: `${perspective}px`,
        } as React.CSSProperties
      }
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      role="region"
      aria-label={`${card.title} skills category`}
    >
      {/* ─── Conic Rotating Border & Spotlight Glow ─── */}
      <div className="card-conic-border-glow" aria-hidden="true" />
      <div className="card-spotlight-layer" aria-hidden="true" />

      {/* ─── Card Inner Content ─── */}
      <div className="card-inner-surface">
        <div className="card-header-bar">
          <div className="card-header-left">
            <span className="card-domain-icon">
              <CardIcon />
            </span>
            <h4 className="card-title-heading">{card.title}</h4>
          </div>

          <span
            className="card-count-badge"
            aria-label={`${displayCount} technologies`}
          >
            {displayCount}
          </span>
        </div>

        {/* ─── Chips Flow ─── */}
        <div className="card-chips-flow" ref={chipsContainerRef}>
          {card.items.map((tech) => (
            <TechChip
              key={tech.name}
              tech={tech}
              hoveredTech={hoveredTech}
              onHover={onHoverTech}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechCard;
