import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { CollectibleCard, VAULT_CONFIG } from "./certificates";
import { VaultItem } from "../tech/HexTile";

interface ConstellationLinksProps {
  activeCard: CollectibleCard | VaultItem | null;
  containerRef: React.RefObject<HTMLDivElement>;
}

interface ConnectionLine {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const ConstellationLinks: React.FC<ConstellationLinksProps> = ({
  activeCard,
  containerRef,
}) => {
  const [lines, setLines] = useState<ConnectionLine[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const relations = activeCard?.relatedTo || activeCard?.relatedIds;
    if (!activeCard || !relations || relations.length === 0 || !containerRef.current) {
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

    relations.forEach((targetId) => {
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

  // Animate lines drawing via strokeDashoffset (0.5s duration)
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
        duration: VAULT_CONFIG.constellation?.drawDuration || 0.5,
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
        <filter id="constellationGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {lines.map((line) => {
        // Curve control point for elegant organic connection
        const dx = line.x2 - line.x1;
        const dy = line.y2 - line.y1;
        const cx = (line.x1 + line.x2) / 2 - dy * 0.08;
        const cy = (line.y1 + line.y2) / 2 + dx * 0.08;
        const pathData = `M ${line.x1} ${line.y1} Q ${cx} ${cy} ${line.x2} ${line.y2}`;

        return (
          <g key={line.id}>
            {/* Soft Glow Layer */}
            <path
              d={pathData}
              fill="none"
              stroke="rgba(196, 181, 253, 0.18)"
              strokeWidth="2"
              filter="url(#constellationGlow)"
            />

            {/* Hairline Primary Path (35% opacity) */}
            <path
              className="constellation-path"
              d={pathData}
              fill="none"
              stroke="#c4b5fd"
              strokeOpacity="0.35"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* Origin & Target End Dots */}
            <circle
              cx={line.x1}
              cy={line.y1}
              r="2.5"
              fill="var(--vault-accent-lavender)"
              opacity="0.8"
            />
            <circle
              cx={line.x2}
              cy={line.y2}
              r="2.5"
              fill="var(--vault-accent-lavender)"
              opacity="0.8"
            />
          </g>
        );
      })}
    </svg>
  );
};

export default ConstellationLinks;
