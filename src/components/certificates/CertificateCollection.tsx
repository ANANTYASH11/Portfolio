import React, { useState, useRef, useCallback, useEffect } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import BoosterPack from "./BoosterPack";
import Album from "./Album";
import CardDetail from "./CardDetail";
import Confetti from "./Confetti";
import { CERTIFICATES, CollectibleCard, COLLECTION_CONFIG } from "./certificates";
import "./tokens.css";

gsap.registerPlugin(Flip);

export const CertificateCollection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnwrapping, setIsUnwrapping] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CollectibleCard | null>(null);
  const [isMascotExcited, setIsMascotExcited] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Step 2: The Unwrap on click
  const handleUnwrap = useCallback(() => {
    if (isOpen || isUnwrapping) return;

    setIsUnwrapping(true);
    setShowConfetti(true);

    // Dim and scale neighbouring Academics content to 0.97
    const academicsNeighbors = document.querySelectorAll(
      ".minor-degree-section > *:not(.cert-collection-section-wrapper), #academics > *:not(.cert-collection-section-wrapper)"
    );
    gsap.to(academicsNeighbors, {
      opacity: 0.45,
      scale: 0.97,
      duration: 0.7,
      ease: "power2.out",
    });

    // Flip rotateY 0 -> 90deg then -90deg -> 0deg with elastic overshoot (back.out(2))
    if (stageRef.current) {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        setIsOpen(true);
        setIsUnwrapping(false);
        setIsMascotExcited(true);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3500);
        return;
      }

      const flipTotal = COLLECTION_CONFIG.pack.flipDuration || 1.0;
      gsap.to(stageRef.current, {
        rotateY: 90,
        scale: 0.94,
        duration: flipTotal * 0.4,
        ease: "power2.in",
        onComplete: () => {
          setIsOpen(true);
          setIsUnwrapping(false);
          setIsMascotExcited(true);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3500);

          if (stageRef.current) {
            gsap.fromTo(
              stageRef.current,
              { rotateY: -90, scale: 0.94 },
              {
                rotateY: 0,
                scale: 1,
                duration: flipTotal * 0.65,
                ease: "back.out(2)",
              }
            );
          }
        },
      });
    } else {
      setTimeout(() => {
        setIsOpen(true);
        setIsUnwrapping(false);
        setIsMascotExcited(true);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3500);
      }, 600);
    }
  }, [isOpen, isUnwrapping]);

  const handleCloseAlbum = useCallback(() => {
    // Restore neighbouring content
    const academicsNeighbors = document.querySelectorAll(
      ".minor-degree-section > *:not(.cert-collection-section-wrapper), #academics > *:not(.cert-collection-section-wrapper)"
    );
    gsap.to(academicsNeighbors, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
    });

    if (stageRef.current) {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        setSelectedCard(null);
        setIsMascotExcited(false);
        setIsOpen(false);
        setIsUnwrapping(false);
        return;
      }

      gsap.to(stageRef.current, {
        rotateY: -90,
        scale: 0.94,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          setSelectedCard(null);
          setIsMascotExcited(false);
          setIsOpen(false);
          setIsUnwrapping(false);

          if (stageRef.current) {
            gsap.fromTo(
              stageRef.current,
              { rotateY: 90, scale: 0.94 },
              {
                rotateY: 0,
                scale: 1,
                duration: 0.5,
                ease: "back.out(1.5)",
              }
            );
          }
        },
      });
    } else {
      setSelectedCard(null);
      setIsMascotExcited(false);
      setIsOpen(false);
      setIsUnwrapping(false);
    }
  }, []);

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
    <div
      ref={containerRef}
      className="cert-collection-section-wrapper"
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* 24 Pieces Candy Confetti Burst */}
      <Confetti
        active={showConfetti}
        onComplete={() => setShowConfetti(false)}
        count={24}
      />

      {/* 3D Flipper Stage */}
      <div
        ref={stageRef}
        className="cert-collection-flipper"
        style={{
          perspective: "1400px",
          transformStyle: "preserve-3d",
          width: "100%",
        }}
      >
        {/* Closed State: Booster Pack */}
        {!isOpen ? (
          <div className="cert-flipper-front-wrap">
            <BoosterPack
              onUnwrap={handleUnwrap}
              isUnwrapping={isUnwrapping}
              onEasterEggConfetti={() => setShowConfetti(true)}
            />
          </div>
        ) : (
          /* Open State: Sticker Album */
          <div className="cert-flipper-back-wrap">
            <Album
              onClose={handleCloseAlbum}
              onCardSelect={(card) => {
                setSelectedCard(card);
                setIsMascotExcited(true);
              }}
              isMascotExcited={isMascotExcited}
            />
          </div>
        )}
      </div>

      {/* "NEW BADGES UNLOCKED!" Bounce Toast */}
      {showToast && (
        <div className="badge-toast-popup">
          <span>✨</span>
          <span>NEW BADGES UNLOCKED!</span>
          <span>🎉</span>
        </div>
      )}

      {/* Card Detail Lightbox Modal */}
      {selectedCard && (
        <CardDetail
          card={selectedCard}
          onClose={() => {
            setSelectedCard(null);
            setIsMascotExcited(false);
          }}
          onNext={handleNextCard}
          onPrev={handlePrevCard}
          currentIndex={currentIndex}
          totalCards={CERTIFICATES.length}
        />
      )}
    </div>
  );
};

export default CertificateCollection;
