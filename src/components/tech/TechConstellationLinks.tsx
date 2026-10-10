import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { TechItem } from "./techData";

interface TechConstellationLinksProps {
  activeCard: TechItem | null;
  containerRef: React.RefObject<HTMLDivElement>;
}

interface ConnectionLine {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const TechConstellationLinks: React.FC<TechConstellationLinksProps> = ({
  activeCard,
  containerRef,
}) => {
  const [lines, setLines] = useState<ConnectionLine[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!activeCard || !activeCard.relatedIds || activeCard.relatedIds.length === 0 || !containerRef.current) {
      setLines([]);
      return;
    }

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    const activeEl = container.querySelector(`[data-card-id="${activeCard.id}"]`) as HTMLElement;
    if (!activeEl) {
      setLines([]);
      return;
    }

    const activeRect = activeEl.getBoundingClientRect();
    const x1 = activeRect.left - containerRect.left + activeRect.width / 2;
    const y1 = activeRect.top - containerRect.top + activeRect.height / 2;

    const newLines: ConnectionLine[] = [];

    activeCard.relatedIds.forEach((targetId) => {
      const targetEl = container.querySelector(`[data-card-id="${targetId}"]`) as HTMLElement;
      if (targetEl) {
        const targetRect = targetEl.getBoundingClientRect();
        const x2 = targetRect.left - containerRect.left + targetRect.width / 2;
        const y2 = targetRect.top - containerRect.top + targetRect.height / 2;

        newLines.push({
          id: `${activeCard.id}->${targetId}`,
          x1,
          y1,
          x2,
          y2,
        });
      }
    });

    setLines(newLines);
  }, [activeCard, containerRef]);

  useEffect(() => {
    if (!svgRef.current || lines.length === 0) return;

    const pathElements = svgRef.current.querySelectorAll(".constellation-path");
    pathElements.forEach((el) => {
      const path = el as SVGPathElement;
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    });
  }, [lines]);

  if (lines.length === 0) return null;

  return (
    <svg
      ref={svgRef}
      className="constellation-svg-layer"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 25,
      }}
      aria-hidden="true"
    >
      <defs>
        <filter id="techConstellationGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {lines.map((line) => {
        const dx = line.x2 - line.x1;
        const dy = line.y2 - line.y1;
        const cx = (line.x1 + line.x2) / 2 - dy * 0.08;
        const cy = (line.y1 + line.y2) / 2 + dx * 0.08;
        const pathData = `M ${line.x1} ${line.y1} Q ${cx} ${cy} ${line.x2} ${line.y2}`;

        return (
          <g key={line.id}>
            <path
              d={pathData}
              fill="none"
              stroke="rgba(196, 181, 253, 0.2)"
              strokeWidth="2.5"
              filter="url(#techConstellationGlow)"
            />
            <path
              className="constellation-path"
              d={pathData}
              fill="none"
              stroke="rgba(196, 181, 253, 0.45)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <circle
              cx={line.x1}
              cy={line.y1}
              r="3"
              fill="var(--vault-accent-lavender)"
              opacity="0.75"
            />
            <circle
              cx={line.x2}
              cy={line.y2}
              r="3"
              fill="var(--vault-accent-lavender)"
              opacity="0.75"
            />
          </g>
        );
      })}
    </svg>
  );
};

export default TechConstellationLinks;
