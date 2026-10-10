import React, { useRef, useMemo, useState, useEffect } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";
import { FiX, FiVolume2, FiVolumeX, FiRotateCcw } from "react-icons/fi";
import {
  CERTIFICATES,
  COLLECTION_FILTERS,
  COLLECTION_CONFIG,
  CollectibleCard,
  CertCategory,
} from "./certificates";
import CollectCard from "./CollectCard";
import Mascot from "./Mascot";
import { collectionAudio } from "./audio";
import "./tokens.css";

gsap.registerPlugin(Flip, Draggable);

interface AlbumProps {
  onClose: () => void;
  onCardSelect: (card: CollectibleCard) => void;
  isMascotExcited: boolean;
}

export const Album: React.FC<AlbumProps> = ({
  onClose,
  onCardSelect,
  isMascotExcited,
}) => {
  const [activeFilter, setActiveFilter] = useState<CertCategory>("all");
  const [isMuted, setIsMuted] = useState(() => collectionAudio.isMuted());
  const [isXpHovered, setIsXpHovered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<CollectibleCard | null>(null);

  const albumRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const xpFillRef = useRef<HTMLDivElement>(null);
  const draggableInstances = useRef<Draggable[]>([]);

  const isReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Filter cards
  const filteredCards = useMemo(() => {
    if (activeFilter === "all") return CERTIFICATES;
    return CERTIFICATES.filter((c) => c.category === activeFilter);
  }, [activeFilter]);

  // Entrance Deal-In Animation (cards dealt with gentle refined spring, max 1.1 overshoot)
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".collect-card-wrap");

    if (isReducedMotion) {
      gsap.fromTo(cards, { opacity: 0 }, { opacity: 1, duration: 0.35, stagger: 0.03 });
      return;
    }

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 40,
        x: (i) => ((i % 4) - 1.5) * 15,
        scale: 0.9,
        rotation: (i) => (i % 2 === 0 ? -6 : 6),
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        rotation: (i) => [-1.8, 1.4, -1.0, 1.6, -1.4, 1.2][i % 6],
        duration: 0.55,
        stagger: 0.05,
        ease: "back.out(1.1)",
      }
    );
  }, [filteredCards, isReducedMotion]);

  // Springy XP Progress Bar Fill
  useEffect(() => {
    if (!xpFillRef.current) return;
    const fillPct = (COLLECTION_CONFIG.currentCount / 25) * 100;

    gsap.fromTo(
      xpFillRef.current,
      { width: "0%" },
      {
        width: `${fillPct}%`,
        duration: 1.0,
        ease: "power2.out",
      }
    );
  }, []);

  // GSAP Draggable Setup on cards
  useEffect(() => {
    if (!gridRef.current) return;
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch || isReducedMotion) return;

    // Clean up previous draggables
    draggableInstances.current.forEach((d) => d.kill());
    draggableInstances.current = [];

    const cardElements = gridRef.current.querySelectorAll<HTMLElement>(".collect-card-wrap");

    cardElements.forEach((el) => {
      const instance = Draggable.create(el, {
        type: "x,y",
        edgeResistance: 0.75,
        bounds: gridRef.current || undefined,
        inertia: true,
        onPress: function () {
          collectionAudio.playPop();
          gsap.to(this.target, {
            scale: 1.04,
            rotation: 0,
            zIndex: 100,
            duration: 0.2,
            ease: "power2.out",
          });
        },
        onRelease: function () {
          gsap.to(this.target, {
            scale: 1,
            zIndex: 1,
            duration: 0.3,
            ease: "back.out(1.1)",
          });
        },
      })[0];

      if (instance) draggableInstances.current.push(instance);
    });

    return () => {
      draggableInstances.current.forEach((d) => d.kill());
      draggableInstances.current = [];
    };
  }, [filteredCards, isReducedMotion]);

  // Reset Layout Button (springs cards back to neat rotated positions)
  const handleResetLayout = () => {
    collectionAudio.playPop();
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll<HTMLElement>(".collect-card-wrap");

    cards.forEach((el, i) => {
      const origRot = [-1.8, 1.4, -1.0, 1.6, -1.4, 1.2][i % 6];
      gsap.to(el, {
        x: 0,
        y: 0,
        rotation: isReducedMotion ? 0 : origRot,
        scale: 1,
        duration: 0.45,
        ease: "back.out(1.1)",
      });
    });
  };

  // GSAP Flip on filter chip click
  const handleFilterChange = (cat: CertCategory) => {
    if (cat === activeFilter || !gridRef.current) return;
    collectionAudio.playPop();

    const state = Flip.getState(gridRef.current.children);
    setActiveFilter(cat);

    requestAnimationFrame(() => {
      if (!gridRef.current) return;
      Flip.from(state, {
        duration: 0.4,
        ease: "power2.out",
        scale: true,
        fade: true,
      });
    });
  };

  // Easter Egg: Konami Code
  useEffect(() => {
    if (isReducedMotion) return;
    const konamiCode = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
      "b", "a",
    ];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          konamiIndex = 0;
          collectionAudio.playDing();
          if (gridRef.current) {
            const cards = gridRef.current.querySelectorAll(".collect-card-wrap");
            gsap.to(cards, {
              rotation: "+=360",
              duration: 0.7,
              stagger: 0.04,
              ease: "power2.out",
            });
          }
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isReducedMotion]);

  return (
    <div
      ref={albumRef}
      id="certificate-album-container"
      className="sticker-album-container album-paper-grid"
      role="region"
      aria-label="Certificate Album Collection"
    >
      {/* Top Album Header Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 className="album-main-title">
            My <span className="album-highlight-word">Collection</span>
          </h2>

          {/* Underline squiggle in lavender */}
          <div style={{ position: "relative", width: "160px", height: "10px", marginTop: "2px" }}>
            <svg width="160" height="10" viewBox="0 0 160 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="marker-squiggle-svg">
              <path
                d="M2 6C30 2 60 9 90 4C120 -1 140 8 158 5"
                stroke="#c4b5fd"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <p
            style={{
              fontFamily: "var(--candy-font-body)",
              fontSize: "15px",
              color: "rgba(196, 181, 253, 0.7)",
              margin: "10px 0 0 0",
              fontWeight: 500,
            }}
          >
            18 credentials, verified at source.
          </p>
        </div>

        {/* Controls: Mascot, Mute, Reset, Close */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Mascot isExcited={isMascotExcited} />

          <button
            onClick={() => setIsMuted(collectionAudio.toggleMute())}
            className="sticker-filter-chip"
            style={{
              padding: "6px 14px",
              fontSize: "11px",
              background: "rgba(196, 181, 253, 0.06)",
              border: "1px solid rgba(196, 181, 253, 0.25)",
              color: "#c4b5fd",
            }}
            type="button"
            aria-label={isMuted ? "Sound muted" : "Sound enabled"}
          >
            {isMuted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
            <span>{isMuted ? "SOUND: OFF" : "SOUND: ON"}</span>
          </button>

          <button
            onClick={handleResetLayout}
            className="sticker-filter-chip"
            style={{
              padding: "6px 14px",
              fontSize: "11px",
              background: "rgba(196, 181, 253, 0.06)",
              border: "1px solid rgba(196, 181, 253, 0.25)",
              color: "#c4b5fd",
            }}
            type="button"
            title="Reset cards layout"
          >
            <FiRotateCcw size={13} />
            <span>Reset layout</span>
          </button>

          <button
            onClick={onClose}
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "rgba(196, 181, 253, 0.08)",
              color: "#c4b5fd",
              border: "1.5px solid rgba(196, 181, 253, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            aria-label="Close album"
            type="button"
          >
            <FiX size={18} />
          </button>
        </div>
      </div>

      {/* Game XP Progress Bar with Star Rider & Hover Tooltip */}
      <div
        className="album-xp-wrap"
        onMouseEnter={() => setIsXpHovered(true)}
        onMouseLeave={() => setIsXpHovered(false)}
        style={{ position: "relative" }}
      >
        <div className="album-xp-labels">
          <span>
            {COLLECTION_CONFIG.currentCount} / {COLLECTION_CONFIG.totalGoal} COLLECTED
          </span>
          <span style={{ color: "var(--vault-lavender)" }}>
            ORACLE CERTIFIED ★
          </span>
        </div>

        <div className="album-xp-outer-track">
          <div ref={xpFillRef} className="album-xp-fill">
            <span className="album-xp-star-rider">★</span>
          </div>
        </div>

        {/* Hover Tooltip: Next unlock */}
        {isXpHovered && (
          <div
            style={{
              position: "absolute",
              top: "-36px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#181324",
              border: "1.5px solid rgba(196, 181, 253, 0.4)",
              borderRadius: "var(--candy-radius-pill)",
              padding: "4px 14px",
              fontFamily: "var(--candy-font-mono)",
              fontSize: "11px",
              color: "var(--vault-lavender)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
              whiteSpace: "nowrap",
              zIndex: 30,
            }}
          >
            {COLLECTION_CONFIG.nextUnlockTitle}
          </div>
        )}
      </div>

      {/* Filter Chips (Stickers) with Count Badges */}
      <div className="album-filters-row">
        {COLLECTION_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => handleFilterChange(f.value)}
            className={`sticker-filter-chip ${activeFilter === f.value ? "active" : ""}`}
            type="button"
          >
            <span>{f.label}</span>
            <span style={{ marginLeft: "6px", opacity: 0.85 }}>({f.count})</span>
          </button>
        ))}
      </div>

      {/* Draggable Cards Grid */}
      <div ref={gridRef} className="cards-sticker-grid">
        {filteredCards.map((card, i) => {
          const relations = hoveredCard?.relatedTo || hoveredCard?.relatedIds || [];
          const isRelated = relations.includes(card.id);
          const isSelected = hoveredCard?.id === card.id;
          const isHighlighted = isSelected || isRelated;
          const isDimmed = hoveredCard !== null && !isHighlighted;

          return (
            <CollectCard
              key={card.id}
              card={card}
              index={i}
              isDimmed={isDimmed}
              isHighlighted={isHighlighted}
              onHover={setHoveredCard}
              onLeave={() => setHoveredCard(null)}
              onClick={onCardSelect}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Album;
