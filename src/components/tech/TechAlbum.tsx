import React, { useRef, useMemo, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { FiX, FiVolume2, FiVolumeX } from "react-icons/fi";
import { TechItem, DomainId, TECH_VAULT_ITEMS } from "./techData";
import TechCollectCard from "./TechCollectCard";
import TechConstellationLinks from "./TechConstellationLinks";
import TechMilestoneProgress from "./TechMilestoneProgress";
import Mascot from "../certificates/Mascot";
import { collectionAudio } from "../certificates/audio";
import { COLLECTION_CONFIG } from "../certificates/certificates";
import "../certificates/tokens.css";

gsap.registerPlugin(Flip);

interface TechAlbumProps {
  onClose: () => void;
  onCardSelect: (card: TechItem) => void;
  isMascotExcited: boolean;
}

const TECH_FILTERS: { label: string; value: "all" | DomainId }[] = [
  { label: "All Tech", value: "all" },
  { label: "Languages", value: "languages" },
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Databases", value: "databases" },
  { label: "Systems", value: "systems" },
  { label: "AI & Cloud", value: "ai_cloud" },
];

export const TechAlbum: React.FC<TechAlbumProps> = ({
  onClose,
  onCardSelect,
  isMascotExcited,
}) => {
  const [activeFilter, setActiveFilter] = useState<"all" | DomainId>("all");
  const [isMuted, setIsMuted] = useState(() => collectionAudio.isMuted());
  const [hoveredCard, setHoveredCard] = useState<TechItem | null>(null);

  const albumRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const filteredCards = useMemo(() => {
    if (activeFilter === "all") return TECH_VAULT_ITEMS;
    return TECH_VAULT_ITEMS.filter((c) => c.domain === activeFilter);
  }, [activeFilter]);

  // Entrance Deal-In along an arc
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".collect-card-wrap");

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 40,
        x: (i) => ((i % 3) - 1) * 20,
        rotation: (i) => (i % 2 === 0 ? -4 : 4),
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        rotation: 0,
        scale: 1,
        duration: 0.55,
        stagger: 0.03,
        ease: "power3.out",
      }
    );
  }, [filteredCards]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!spotlightRef.current || !albumRef.current) return;
    const rect = albumRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gsap.to(spotlightRef.current, {
      x,
      y,
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  // GSAP Flip on filter chip click
  const handleFilterChange = useCallback(
    (newFilter: "all" | DomainId) => {
      if (newFilter === activeFilter || !gridRef.current) return;
      collectionAudio.playPop();

      const state = Flip.getState(gridRef.current.children);
      setActiveFilter(newFilter);

      requestAnimationFrame(() => {
        if (!gridRef.current) return;
        Flip.from(state, {
          duration: 0.35,
          ease: "power3.out",
          stagger: 0.02,
          onEnter: (elements) =>
            gsap.fromTo(
              elements,
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }
            ),
          onLeave: (elements) =>
            gsap.to(elements, { opacity: 0, duration: 0.2 }),
        });
      });
    },
    [activeFilter]
  );

  const handleToggleMute = useCallback(() => {
    const next = collectionAudio.toggleMute();
    setIsMuted(next);
  }, []);

  return (
    <div
      ref={albumRef}
      onMouseMove={handleMouseMove}
      className="album-paper-grid"
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Cursor Spotlight */}
      <div
        ref={spotlightRef}
        className="album-spotlight"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${COLLECTION_CONFIG.spotlight.radiusPx * 2}px`,
          height: `${COLLECTION_CONFIG.spotlight.radiusPx * 2}px`,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Signature 3: Constellation Links */}
      <TechConstellationLinks
        activeCard={hoveredCard}
        containerRef={albumRef}
      />

      {/* Header */}
      <header className="album-header-wrap" style={{ position: "relative", zIndex: 5 }}>
        <div className="album-title-controls-row">
          <div>
            <h2 className="album-main-title">
              <span>My</span>
              <span className="album-title-highlight">Tech Stack</span>
            </h2>
            <span className="album-subtitle-note">
              41 core engineering technologies across 6 production domains.
            </span>
          </div>

          <div className="album-controls-cluster">
            <Mascot isExcited={isMascotExcited} />

            <button
              onClick={handleToggleMute}
              className="album-sound-btn"
              title={isMuted ? "Sound is muted" : "Sound is active"}
              aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
            >
              {isMuted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
              <span>{isMuted ? "SOUND: OFF" : "SOUND: ON"}</span>
            </button>

            <button
              onClick={() => {
                collectionAudio.playPop();
                onClose();
              }}
              className="album-close-btn"
              aria-label="Close album"
              title="Close Vault (Esc)"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Signature 4: Milestone Progress */}
        <TechMilestoneProgress />

        {/* Domain Filter Tabs */}
        <nav className="album-filters-nav" aria-label="Technology filters">
          {TECH_FILTERS.map((filter) => {
            const count =
              filter.value === "all"
                ? TECH_VAULT_ITEMS.length
                : TECH_VAULT_ITEMS.filter((c) => c.domain === filter.value).length;
            const isActive = activeFilter === filter.value;

            return (
              <button
                key={filter.value}
                onClick={() => handleFilterChange(filter.value)}
                className={`album-filter-chip ${isActive ? "active" : ""}`}
                aria-pressed={isActive}
              >
                <span>{filter.label}</span>
                <span className="album-chip-count">{count}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Collectible Cards Grid */}
      <main ref={gridRef} className="album-cards-grid" style={{ position: "relative", zIndex: 5 }}>
        {filteredCards.map((card, index) => {
          const isDimmed =
            hoveredCard !== null &&
            hoveredCard.id !== card.id &&
            !hoveredCard.relatedIds.includes(card.id);

          const isHighlighted =
            hoveredCard !== null &&
            (hoveredCard.id === card.id || hoveredCard.relatedIds.includes(card.id));

          return (
            <TechCollectCard
              key={card.id}
              card={card}
              index={index}
              isDimmed={isDimmed}
              isHighlighted={isHighlighted}
              onHover={setHoveredCard}
              onLeave={() => setHoveredCard(null)}
              onClick={onCardSelect}
            />
          );
        })}
      </main>
    </div>
  );
};

export default TechAlbum;
