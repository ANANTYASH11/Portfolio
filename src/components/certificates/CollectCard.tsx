import React, { useRef, useEffect, useCallback, useState } from "react";
import gsap from "gsap";
import { CollectibleCard, COLLECTION_CONFIG } from "./certificates";
import { collectionAudio } from "./audio";
import { FiAward, FiShield, FiCode } from "react-icons/fi";
import { LuBrainCircuit } from "react-icons/lu";

interface CollectCardProps {
  card: CollectibleCard;
  index: number;
  isDimmed?: boolean;
  isHighlighted?: boolean;
  onHover?: (card: CollectibleCard) => void;
  onLeave?: () => void;
  onClick: (card: CollectibleCard) => void;
}

export const CollectCard: React.FC<CollectCardProps> = ({
  card,
  index,
  isDimmed = false,
  isHighlighted = false,
  onHover,
  onLeave,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isLegendary = card.rarity === "legendary";
  const [rotation] = useState(() => {
    // Random loose rotation between -3deg and +3deg
    const angles = [-2.8, -1.5, 1.2, 2.5, -2.0, 1.8];
    return angles[index % angles.length];
  });

  // 3D tilt & holographic position via gsap.quickTo
  const rotXTo = useRef<gsap.QuickToFunc | null>(null);
  const rotYTo = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    if (!cardRef.current || !isLegendary) return;

    rotXTo.current = gsap.quickTo(cardRef.current, "rotationX", {
      duration: COLLECTION_CONFIG.holoFoil.tiltSpeed,
      ease: "power2.out",
    });
    rotYTo.current = gsap.quickTo(cardRef.current, "rotationY", {
      duration: COLLECTION_CONFIG.holoFoil.tiltSpeed,
      ease: "power2.out",
    });
  }, [isLegendary]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xPct = ((x / rect.width) - 0.5) * 2;
      const yPct = ((y / rect.height) - 0.5) * 2;

      // Holographic gradient follows cursor on Oracle cards
      cardRef.current.style.setProperty("--cursor-x", `${(x / rect.width) * 100}%`);
      cardRef.current.style.setProperty("--cursor-y", `${(y / rect.height) * 100}%`);

      if (isLegendary && rotXTo.current && rotYTo.current) {
        rotXTo.current(-yPct * COLLECTION_CONFIG.holoFoil.maxTiltDeg);
        rotYTo.current(xPct * COLLECTION_CONFIG.holoFoil.maxTiltDeg);
      }
    },
    [isLegendary]
  );

  const handleMouseEnter = useCallback(() => {
    if (!cardRef.current) return;
    collectionAudio.playPop();

    // Wiggle and push shadow further on hover
    gsap.to(cardRef.current, {
      y: -6,
      rotation: 0,
      scale: 1.02,
      duration: 0.25,
      ease: "back.out(1.1)",
    });

    if (onHover) onHover(card);
  }, [card, onHover]);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;

    gsap.to(cardRef.current, {
      y: 0,
      rotation,
      scale: 1,
      duration: 0.25,
      ease: "power2.out",
    });

    if (rotXTo.current && rotYTo.current) {
      rotXTo.current(0);
      rotYTo.current(0);
    }

    if (onLeave) onLeave();
  }, [rotation, onLeave]);

  const handleClick = useCallback(() => {
    collectionAudio.playDing();
    onClick(card);
  }, [card, onClick]);

  const IconComponent =
    card.category === "oracle"
      ? LuBrainCircuit
      : card.category === "internship"
      ? FiCode
      : card.category === "training"
      ? FiAward
      : FiShield;

  const badgeClass =
    card.rarity === "legendary"
      ? "badge-legendary"
      : card.rarity === "rare"
      ? "badge-rare"
      : "badge-epic";

  return (
    <div
      ref={cardRef}
      className={`collect-card-wrap card-rarity-${card.rarity}`}
      style={{
        transform: `rotate(${rotation}deg)${isHighlighted ? " scale(1.04)" : ""}`,
        opacity: isDimmed ? 0.35 : 1,
        transition: "opacity 0.25s ease, transform 0.25s ease",
      }}
      data-card-id={card.id}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`${card.title} by ${card.issuer}. ${card.rarity.toUpperCase()} card. Click for full certificate details.`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
    >
      <div
        className="collect-card-inner"
        style={{
          boxShadow: "6px 6px 0 #3b2a6b, 0 10px 24px rgba(0, 0, 0, 0.45)",
        }}
      >
        {/* Top Header: Number and Rarity Sticker */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="card-number-label">{card.number}</span>
          <span className={`card-rarity-badge ${badgeClass}`}>
            {card.rarity.toUpperCase()}
          </span>
        </div>

        {/* Thumbnail Window with lavender line icon */}
        <div className="card-thumb-window">
          <IconComponent size={42} color="#c4b5fd" strokeWidth={1.8} />
        </div>

        {/* Card Title & Issuer */}
        <div>
          <h4
            style={{
              fontFamily: "var(--candy-font-display)",
              fontSize: "16px",
              fontWeight: 700,
              lineHeight: 1.25,
              color: "#ffffff",
              margin: "4px 0",
            }}
          >
            {card.title}
          </h4>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "8px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--candy-font-body)",
                fontSize: "13px",
                color: "rgba(248, 249, 250, 0.75)",
                fontWeight: 500,
              }}
            >
              {card.issuer}
            </span>

            <span
              style={{
                fontFamily: "var(--candy-font-mono)",
                fontSize: "11px",
                color: "var(--vault-lavender)",
                fontWeight: 600,
              }}
            >
              {card.date}
            </span>
          </div>

          {/* Handwritten Annotation if present in lavender */}
          {card.note && (
            <div className="card-caveat-note">
              ~ {card.note}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectCard;
