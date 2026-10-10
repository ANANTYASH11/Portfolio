import React, { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { TechItem } from "./techData";
import { collectionAudio } from "../certificates/audio";
import { COLLECTION_CONFIG } from "../certificates/certificates";

interface TechCollectCardProps {
  card: TechItem;
  index: number;
  isDimmed?: boolean;
  isHighlighted?: boolean;
  onHover?: (card: TechItem) => void;
  onLeave?: () => void;
  onClick: (card: TechItem) => void;
}

export const TechCollectCard: React.FC<TechCollectCardProps> = ({
  card,
  index,
  isDimmed = false,
  isHighlighted = false,
  onHover,
  onLeave,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const numFormatted = `#${String(index + 1).padStart(3, "0")}/041`;
  const isSpecialist = card.isPrimary || card.proficiency >= 90;

  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    if (!cardRef.current || !isSpecialist) return;

    xTo.current = gsap.quickTo(cardRef.current, "rotationY", {
      duration: COLLECTION_CONFIG.holoFoil.tiltSpeed,
      ease: "power2.out",
    });
    yTo.current = gsap.quickTo(cardRef.current, "rotationX", {
      duration: COLLECTION_CONFIG.holoFoil.tiltSpeed,
      ease: "power2.out",
    });
  }, [isSpecialist]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || !isSpecialist) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const mx = `${(x / rect.width) * 100}%`;
      const my = `${(y / rect.height) * 100}%`;

      cardRef.current.style.setProperty("--mx", mx);
      cardRef.current.style.setProperty("--my", my);

      const rotY = ((x / rect.width) - 0.5) * (COLLECTION_CONFIG.holoFoil.maxTiltDeg * 2);
      const rotX = -((y / rect.height) - 0.5) * (COLLECTION_CONFIG.holoFoil.maxTiltDeg * 2);

      if (xTo.current && yTo.current) {
        xTo.current(rotY);
        yTo.current(rotX);
      }
    },
    [isSpecialist]
  );

  const handleMouseEnter = useCallback(() => {
    if (onHover) onHover(card);
  }, [card, onHover]);

  const handleMouseLeave = useCallback(() => {
    if (onLeave) onLeave();
    if (cardRef.current && isSpecialist) {
      if (xTo.current && yTo.current) {
        xTo.current(0);
        yTo.current(0);
      }
    }
  }, [isSpecialist, onLeave]);

  const handleClick = useCallback(() => {
    collectionAudio.playPop();
    onClick(card);
  }, [card, onClick]);

  const IconComponent = card.icon;

  return (
    <div
      ref={cardRef}
      data-card-id={card.id}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      className={`collect-card-wrap ${isSpecialist ? "is-legendary" : ""} ${isDimmed ? "is-dimmed" : ""} ${isHighlighted ? "is-highlighted" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={`${card.name} Tech Card (${numFormatted}). ${card.relatedIds.length > 0 ? `Related to ${card.relatedIds.length} technologies.` : ""}`}
      data-cursor="disable"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      style={{
        opacity: isDimmed ? COLLECTION_CONFIG.constellation.dimmedCardOpacity : 1,
        transition: "opacity 0.3s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease",
        transformStyle: isSpecialist ? "preserve-3d" : "flat",
      }}
    >
      {/* Iridescent Sheen on Specialist */}
      {isSpecialist && (
        <div
          className="holo-foil-sheen"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "var(--vault-radius)",
            pointerEvents: "none",
            background: "linear-gradient(135deg, transparent 30%, rgba(196, 181, 253, 0.08) 50%, rgba(0, 240, 255, 0.05) 60%, transparent 80%)",
            backgroundPosition: "var(--mx, 50%) var(--my, 50%)",
            opacity: COLLECTION_CONFIG.holoFoil.sheenOpacity,
            zIndex: 2,
          }}
        />
      )}

      {/* Top Row: Number & Domain Tag */}
      <div className="collect-card-top-row">
        <span className="collect-card-num">{numFormatted}</span>
        <span className={`rarity-badge ${isSpecialist ? "legendary" : "rare"}`}>
          {card.domain.toUpperCase()}
        </span>
      </div>

      {/* Card Icon Thumbnail Box */}
      <div className="collect-card-thumb">
        <div className="collect-thumb-placeholder">
          <div className="collect-thumb-icon">
            <IconComponent style={{ fontSize: "30px" }} />
          </div>
          <span className="collect-thumb-tag">
            {card.tag || card.experience}
          </span>
        </div>
      </div>

      {/* Card Info Details */}
      <div className="collect-card-info">
        <h4 className="collect-card-title">{card.name}</h4>
        <span className="collect-card-issuer">{card.oneLiner}</span>
        <div className="collect-card-meta-row">
          <span className="collect-card-date">{card.experience}</span>
          <span className="collect-card-flip-prompt">
            INSPECT ↗
          </span>
        </div>
      </div>
    </div>
  );
};

export default TechCollectCard;
