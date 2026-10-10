import React, { useState, useRef, useCallback, useEffect } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import BoosterPack from "./BoosterPack";
import Album from "./Album";
import CardDetail from "./CardDetail";
import Confetti from "./Confetti";
import { CERTIFICATES, CollectibleCard } from "./certificates";
import "./tokens.css";

gsap.registerPlugin(Flip);

export const CertificateVault: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnwrapping, setIsUnwrapping] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CollectibleCard | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const isReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Unwrap / Open Transition
  const handleUnwrap = useCallback(() => {
    if (isOpen || isUnwrapping) return;

    setIsUnwrapping(true);
    if (!isReducedMotion) {
      setShowConfetti(true);
    }

    if (isReducedMotion) {
      setIsOpen(true);
      setIsUnwrapping(false);
      return;
    }

    if (stageRef.current) {
      const flipDuration = 0.85;
      gsap.to(stageRef.current, {
        rotateY: 90,
        scale: 0.95,
        duration: flipDuration * 0.4,
        ease: "power2.in",
        onComplete: () => {
          setIsOpen(true);
          setIsUnwrapping(false);

          if (stageRef.current) {
            gsap.fromTo(
              stageRef.current,
              { rotateY: -90, scale: 0.95 },
              {
                rotateY: 0,
                scale: 1,
                duration: flipDuration * 0.6,
                ease: "back.out(1.1)",
              }
            );
          }
        },
      });
    } else {
      setIsOpen(true);
      setIsUnwrapping(false);
    }
  }, [isOpen, isUnwrapping, isReducedMotion]);

  // Close / Pack Fold Transition
  const handleCloseAlbum = useCallback(() => {
    setSelectedCard(null);

    if (isReducedMotion) {
      setIsOpen(false);
      setIsUnwrapping(false);
      return;
    }

    if (stageRef.current) {
      gsap.to(stageRef.current, {
        rotateY: -90,
        scale: 0.95,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          setIsOpen(false);
          setIsUnwrapping(false);

          if (stageRef.current) {
            gsap.fromTo(
              stageRef.current,
              { rotateY: 90, scale: 0.95 },
              {
                rotateY: 0,
                scale: 1,
                duration: 0.45,
                ease: "back.out(1.1)",
              }
            );
          }
        },
      });
    } else {
      setIsOpen(false);
      setIsUnwrapping(false);
    }
  }, [isReducedMotion]);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedCard) {
          setSelectedCard(null);
        } else if (isOpen) {
          handleCloseAlbum();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCard, isOpen, handleCloseAlbum]);

  const currentIndex = selectedCard
    ? CERTIFICATES.findIndex((c) => c.id === selectedCard.id)
    : -1;

  const handleNextCard = useCallback(() => {
    if (currentIndex < CERTIFICATES.length - 1) {
      setSelectedCard(CERTIFICATES[currentIndex + 1]);
    } else {
      setSelectedCard(CERTIFICATES[0]);
    }
  }, [currentIndex]);

  const handlePrevCard = useCallback(() => {
    if (currentIndex > 0) {
      setSelectedCard(CERTIFICATES[currentIndex - 1]);
    } else {
      setSelectedCard(CERTIFICATES[CERTIFICATES.length - 1]);
    }
  }, [currentIndex]);

  return (
    <section
      ref={sectionRef}
      id="certificate-vault-section"
      className="cert-vault-section-container"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        paddingTop: "96px",
        paddingBottom: "120px",
        paddingLeft: "24px",
        paddingRight: "24px",
        scrollMarginTop: "110px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      aria-label="Certificate Vault"
    >
      {/* 24 Pieces Lavender/Violet Confetti Burst */}
      <Confetti
        active={showConfetti}
        onComplete={() => setShowConfetti(false)}
        count={24}
      />

      {/* Section Header */}
      <div
        className="vault-section-header"
        style={{
          textAlign: "center",
          marginBottom: "36px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div
          style={{
            fontFamily: "var(--candy-font-mono)",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "var(--vault-lavender)",
            opacity: 0.7,
            fontWeight: 600,
          }}
        >
          VERIFIED CREDENTIALS · 25+ ACHIEVEMENTS
        </div>

        <h2
          style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#ffffff",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Certificate{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #c4b5fd, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Vault
          </span>
        </h2>

        <p
          style={{
            fontFamily: "var(--candy-font-body)",
            fontSize: "15px",
            color: "rgba(255, 255, 255, 0.65)",
            margin: "4px 0 0 0",
            maxWidth: "540px",
            lineHeight: 1.5,
          }}
        >
          18 credentials verified at source from Oracle University, IIT Guwahati,
          and software engineering institutions.
        </p>
      </div>

      {/* 3D Perspective Flipper Stage */}
      <div
        ref={stageRef}
        className="cert-3d-flipper-stage"
        style={{
          perspective: "1400px",
          transformStyle: "preserve-3d",
          width: "100%",
        }}
      >
        {!isOpen ? (
          <div className="cert-flipper-front-wrapper">
            <BoosterPack
              onUnwrap={handleUnwrap}
              isUnwrapping={isUnwrapping}
              onEasterEggConfetti={() => setShowConfetti(true)}
            />
          </div>
        ) : (
          <div className="cert-flipper-back-wrapper" id="certificate-album-container">
            <Album
              onClose={handleCloseAlbum}
              onCardSelect={(card) => setSelectedCard(card)}
              isMascotExcited={false}
            />
          </div>
        )}
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardDetail
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onNext={handleNextCard}
          onPrev={handlePrevCard}
          currentIndex={currentIndex}
          totalCards={CERTIFICATES.length}
        />
      )}
    </section>
  );
};

export default CertificateVault;
