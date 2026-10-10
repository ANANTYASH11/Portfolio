import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiDownload,
  FiRotateCw,
} from "react-icons/fi";
import { CollectibleCard } from "./certificates";
import { collectionAudio } from "./audio";

interface CardDetailProps {
  card: CollectibleCard;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalCards: number;
}

export const CardDetail: React.FC<CardDetailProps> = ({
  card,
  onClose,
  onNext,
  onPrev,
  currentIndex,
  totalCards,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardFlipperRef = useRef<HTMLDivElement>(null);
  const skillBarsRef = useRef<HTMLDivElement>(null);
  const isLegendary = card.rarity === "legendary";

  useEffect(() => {
    collectionAudio.playDing();
  }, [card]);

  // Lock body scroll while modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Keyboard navigation: Left/Right arrows, Esc to close, F to flip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        collectionAudio.playPop();
        onNext();
        setIsFlipped(false);
      } else if (e.key === "ArrowLeft") {
        collectionAudio.playPop();
        onPrev();
        setIsFlipped(false);
      } else if (e.key === "f" || e.key === "F") {
        toggleFlip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

  // 3 Skill Bars Animated Fills
  useEffect(() => {
    if (isFlipped && skillBarsRef.current) {
      const bars = skillBarsRef.current.querySelectorAll(".skill-bar-fill");
      gsap.fromTo(
        bars,
        { width: "0%" },
        {
          width: (i) => `${card.skills[i]?.level || 85}%`,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.08,
        }
      );
    }
  }, [isFlipped, card]);

  const toggleFlip = useCallback(() => {
    collectionAudio.playPop();
    setIsFlipped((prev) => !prev);
  }, []);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Credential Card: ${card.title}`}
      className="detail-modal-overlay"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="detail-card-big"
        style={{
          boxShadow: `12px 12px 0 ${card.color}, 0 25px 60px rgba(0, 0, 0, 0.9)`,
        }}
      >
        {/* Navigation Arrows */}
        {totalCards > 1 && (
          <>
            <button
              onClick={() => {
                collectionAudio.playPop();
                onPrev();
                setIsFlipped(false);
              }}
              style={{
                position: "absolute",
                left: "-56px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "var(--candy-lemon)",
                color: "var(--candy-base)",
                border: "2px solid var(--candy-white)",
                boxShadow: "3px 3px 0 var(--candy-pink)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 20,
              }}
              aria-label="Previous credential card"
              type="button"
            >
              <FiChevronLeft size={22} />
            </button>

            <button
              onClick={() => {
                collectionAudio.playPop();
                onNext();
                setIsFlipped(false);
              }}
              style={{
                position: "absolute",
                right: "-56px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "var(--candy-lemon)",
                color: "var(--candy-base)",
                border: "2px solid var(--candy-white)",
                boxShadow: "3px 3px 0 var(--candy-pink)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 20,
              }}
              aria-label="Next credential card"
              type="button"
            >
              <FiChevronRight size={22} />
            </button>
          </>
        )}

        {/* Top Header Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="card-number-label">{card.number}</span>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "rgba(255, 255, 255, 0.6)" }}>
              [{currentIndex + 1}/{totalCards}]
            </span>
            <span
              className={`card-rarity-badge ${
                card.rarity === "legendary"
                  ? "badge-legendary"
                  : card.rarity === "rare"
                  ? "badge-rare"
                  : "badge-epic"
              }`}
            >
              {card.rarity.toUpperCase()}
            </span>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={toggleFlip}
              className="chunky-action-btn"
              style={{ padding: "6px 12px", fontSize: "11px" }}
              title="Click to flip (or press F)"
              type="button"
            >
              <FiRotateCw size={14} />
              <span>Flip</span>
            </button>

            <button
              onClick={onClose}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "var(--candy-pink)",
                color: "var(--candy-white)",
                border: "2px solid var(--candy-white)",
                boxShadow: "2px 2px 0 var(--candy-lemon)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              aria-label="Close card detail modal"
              type="button"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Flipper Body */}
        <div
          ref={cardFlipperRef}
          style={{
            position: "relative",
            minHeight: "380px",
            transformStyle: "preserve-3d",
            transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* FRONT FACE: Certificate Display */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "240px",
                borderRadius: "var(--candy-radius-sm)",
                border: "2px solid var(--candy-white)",
                background: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {card.image ? (
                <img
                  src={card.image}
                  alt={card.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ textAlign: "center", padding: "16px" }}>
                  <div style={{ fontSize: "36px", color: card.color }}>✦</div>
                  <div
                    style={{
                      fontFamily: "var(--candy-font-mono)",
                      fontSize: "12px",
                      color: "rgba(248, 249, 250, 0.8)",
                      marginTop: "8px",
                      letterSpacing: "0.08em",
                    }}
                  >
                    100% VERIFIED AT SOURCE
                  </div>
                </div>
              )}

              {isLegendary && (
                <span style={{ position: "absolute", top: "10px", right: "10px", fontSize: "18px", color: "var(--candy-lemon)" }}>
                  ★
                </span>
              )}
            </div>

            <div style={{ marginTop: "12px" }}>
              <h3
                style={{
                  fontFamily: "var(--candy-font-display)",
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "var(--candy-white)",
                  margin: 0,
                }}
              >
                {card.title}
              </h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "6px",
                  fontFamily: "var(--candy-font-mono)",
                  fontSize: "12px",
                  color: "rgba(248, 249, 250, 0.75)",
                }}
              >
                <span>{card.issuer}</span>
                <span style={{ color: card.color }}>{card.date}</span>
              </div>
            </div>

            {/* Action Buttons: Chunky with Hard Offset Shadows */}
            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              {card.credentialUrl && (
                <a
                  href={card.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chunky-action-btn"
                  style={{ flex: 1 }}
                >
                  <FiExternalLink size={14} />
                  <span>Open credential ↗</span>
                </a>
              )}
              {card.downloadUrl && (
                <a
                  href={card.downloadUrl}
                  download
                  className="chunky-action-btn chunky-action-btn-secondary"
                  style={{ flex: 1 }}
                >
                  <FiDownload size={14} />
                  <span>Download</span>
                </a>
              )}
            </div>
          </div>

          {/* BACK FACE: Stats Like a Game Card */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h4
                style={{
                  fontFamily: "var(--candy-font-mono)",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--candy-lemon)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                CREDENTIAL STATS
              </h4>

              <div
                style={{
                  background: "rgba(0, 0, 0, 0.4)",
                  border: "1.5px solid var(--candy-white)",
                  borderRadius: "var(--candy-radius-sm)",
                  padding: "12px",
                  marginBottom: "14px",
                }}
              >
                <div style={{ fontSize: "12px", color: "rgba(248, 249, 250, 0.8)", marginBottom: "4px" }}>
                  <strong>Issuer:</strong> {card.issuer}
                </div>
                <div style={{ fontSize: "12px", color: "rgba(248, 249, 250, 0.8)", marginBottom: "4px" }}>
                  <strong>Verified Date:</strong> {card.date}
                </div>
                {card.credentialId && (
                  <div style={{ fontSize: "12px", color: "rgba(248, 249, 250, 0.8)" }}>
                    <strong>Credential ID:</strong> {card.credentialId}
                  </div>
                )}
              </div>

              {/* 3 Skill Bars */}
              <div ref={skillBarsRef} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {card.skills.map((skill, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontFamily: "var(--candy-font-mono)", color: "var(--candy-white)" }}>
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="skill-bar-track">
                      <div className="skill-bar-fill" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Handwritten Caveat Annotation */}
              {card.note && (
                <div className="card-caveat-note" style={{ fontSize: "22px", marginTop: "14px", textAlign: "center" }}>
                  ★ {card.note}
                </div>
              )}
            </div>

            {/* Back action: Return to certificate view */}
            <button
              onClick={toggleFlip}
              className="chunky-action-btn chunky-action-btn-secondary"
              style={{ width: "100%", marginTop: "14px" }}
              type="button"
            >
              <span>← View certificate</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CardDetail;
