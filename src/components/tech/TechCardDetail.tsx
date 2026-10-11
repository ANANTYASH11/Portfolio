import React, { useEffect } from "react";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { TechItem } from "./techData";
import { collectionAudio } from "../certificates/audio";

interface TechCardDetailProps {
  card: TechItem;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalCards: number;
}

export const TechCardDetail: React.FC<TechCardDetailProps> = ({
  card,
  onClose,
  onNext,
  onPrev,
  currentIndex,
  totalCards,
}) => {
  const numFormatted = `#${String(currentIndex + 1).padStart(3, "0")}/041`;

  useEffect(() => {
    collectionAudio.playDing();
  }, [card]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        collectionAudio.playPop();
        onNext();
      } else if (e.key === "ArrowLeft") {
        collectionAudio.playPop();
        onPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

  const IconComponent = card.icon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Tech Card: ${card.name}`}
      className="detail-modal-overlay"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="detail-modal-box"
      >
        {/* Navigation Arrows */}
        {totalCards > 1 && (
          <>
            <button
              onClick={() => {
                collectionAudio.playPop();
                onPrev();
              }}
              style={{
                position: "absolute",
                left: "-52px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "rgba(22, 18, 31, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "rgba(255, 255, 255, 0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              aria-label="Previous card"
            >
              <FiChevronLeft size={22} />
            </button>
            <button
              onClick={() => {
                collectionAudio.playPop();
                onNext();
              }}
              style={{
                position: "absolute",
                right: "-52px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "rgba(22, 18, 31, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "rgba(255, 255, 255, 0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              aria-label="Next card"
            >
              <FiChevronRight size={22} />
            </button>
          </>
        )}

        {/* Top Row */}
        <div className="detail-top-nav-bar">
          <span className="detail-card-counter">
            {numFormatted} · {card.domain.toUpperCase()}
          </span>
          <button
            onClick={onClose}
            aria-label="Close details"
            className="detail-close-btn"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Center Thumbnail */}
        <div
          style={{
            width: "100%",
            height: "150px",
            borderRadius: "14px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backgroundColor: "#161220",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <div style={{ color: card.brandColor || "#c4b5fd", filter: `drop-shadow(0 2px 12px ${card.brandColor || "#c4b5fd"}66)` }}>
            <IconComponent style={{ fontSize: "44px" }} />
          </div>
          <span
            style={{
              fontFamily: "var(--vault-font-label)",
              fontSize: "11px",
              fontWeight: 600,
              padding: "2px 10px",
              borderRadius: "100px",
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "var(--vault-text-body)",
            }}
          >
            {card.tag || card.experience}
          </span>
        </div>

        {/* Title & Description */}
        <div>
          <h3
            style={{
              fontFamily: "var(--vault-font-body)",
              fontSize: "20px",
              fontWeight: 600,
              color: "var(--vault-text-title)",
              margin: "0 0 6px 0",
            }}
          >
            {card.name}
          </h3>
          <p
            style={{
              fontFamily: "var(--vault-font-body)",
              fontSize: "14px",
              color: "var(--vault-text-body)",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {card.oneLiner}
          </p>
        </div>

        {/* What I Built Quote */}
        <div
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            fontFamily: "var(--vault-font-body)",
            fontSize: "13px",
            color: "var(--vault-text-title)",
          }}
        >
          &ldquo;{card.whatIBuilt}&rdquo;
        </div>

        {/* Proficiency Gauge */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--vault-font-label)",
              fontSize: "11px",
              fontWeight: 600,
              marginBottom: "6px",
              color: "var(--vault-text-label)",
            }}
          >
            <span>PROFICIENCY LEVEL</span>
            <span style={{ color: "var(--vault-accent-lavender)" }}>{card.proficiency}%</span>
          </div>
          <div
            style={{
              width: "100%",
              height: "4px",
              borderRadius: "100px",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${card.proficiency}%`,
                height: "100%",
                background: "var(--vault-gradient-primary)",
                borderRadius: "100px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechCardDetail;
