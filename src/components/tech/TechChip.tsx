import { useRef, useEffect } from "react";
import gsap from "gsap";

export interface TechChipData {
  name: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  tag?: string;
}

interface TechChipProps {
  tech: TechChipData;
  hoveredTech: string | null;
  onHover: (name: string | null) => void;
  magneticStrength?: number;
}

export const TechChip = ({
  tech,
  hoveredTech,
  onHover,
  magneticStrength = 5,
}: TechChipProps) => {
  const chipRef = useRef<HTMLDivElement | null>(null);

  // Is this chip currently active or dimmed by another hovered chip?
  const isMatch = hoveredTech === tech.name;
  const isDimmed = hoveredTech !== null && !isMatch;

  const quickToX = useRef<((val: number) => void) | null>(null);
  const quickToY = useRef<((val: number) => void) | null>(null);

  useEffect(() => {
    if (!chipRef.current) return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isTouch && !reducedMotion) {
      quickToX.current = gsap.quickTo(chipRef.current, "x", {
        duration: 0.35,
        ease: "power2.out",
      });
      quickToY.current = gsap.quickTo(chipRef.current, "y", {
        duration: 0.35,
        ease: "power2.out",
      });
    }

    return () => {
      quickToX.current = null;
      quickToY.current = null;
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!chipRef.current || !quickToX.current || !quickToY.current) return;
    const rect = chipRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    quickToX.current(deltaX * magneticStrength);
    quickToY.current(deltaY * magneticStrength);
  };

  const handlePointerLeave = () => {
    onHover(null);
    if (quickToX.current && quickToY.current) {
      quickToX.current(0);
      quickToY.current(0);
    }
  };

  const handlePointerEnter = () => {
    onHover(tech.name);
  };

  const IconComponent = tech.icon;

  return (
    <div
      ref={chipRef}
      className={`tech-chip-item ${isMatch ? "highlighted" : ""} ${
        isDimmed ? "dimmed" : ""
      }`}
      style={
        {
          "--tech-color": tech.color,
        } as React.CSSProperties
      }
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      role="button"
      tabIndex={0}
      aria-label={`${tech.name} ${tech.tag ? `— ${tech.tag}` : ""}`}
      onFocus={() => onHover(tech.name)}
      onBlur={() => onHover(null)}
    >
      <span
        className="chip-icon-box"
        style={{ color: tech.color }}
      >
        <IconComponent />
      </span>

      <span className="chip-name-text">{tech.name}</span>

      {tech.tag && (
        <span className="chip-tag-pill">
          <span className="pill-shimmer-sweep" />
          {tech.tag}
        </span>
      )}
    </div>
  );
};

export default TechChip;
