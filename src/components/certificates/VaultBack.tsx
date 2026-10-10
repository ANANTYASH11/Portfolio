import React, { useRef, useState, useMemo, useEffect, useCallback } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import {
  FiX,
  FiVolume2,
  FiVolumeX,
  FiRotateCcw,
  FiSearch,
} from "react-icons/fi";
import {
  VAULT_CONFIG,
  CERTIFICATES,
  COLLECTION_FILTERS,
  getCertificateClusters,
  CertCategory,
} from "./certificates";
import DomainCluster from "../tech/DomainCluster";
import { VaultItem } from "../tech/HexTile";
import Mascot from "./Mascot";
import { ConstellationLinks } from "./ConstellationLinks";
import { MilestoneStrip } from "./MilestoneStrip";
import { collectionAudio } from "./audio";
import { useVaultAnimations } from "./useVaultAnimations";
import "./tokens.css";
import "../styles/vault.css";

gsap.registerPlugin(Flip);

interface VaultBackProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VaultBack: React.FC<VaultBackProps> = ({ isOpen, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleCharsRef = useRef<HTMLHeadingElement>(null);
  const tabsNavRef = useRef<HTMLElement>(null);
  const tabIndicatorRef = useRef<HTMLDivElement>(null);
  const clustersAreaRef = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState<CertCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCard, setHoveredCard] = useState<VaultItem | null>(null);
  const [isMuted, setIsMuted] = useState(() => collectionAudio.isMuted());

  const clusters = useMemo(() => getCertificateClusters(), []);

  const filteredClusters = useMemo(() => {
    if (activeFilter === "all") return clusters;
    return clusters.filter((c) => c.id === activeFilter);
  }, [clusters, activeFilter]);

  const { animateTitleReveal, animateTabSlide } = useVaultAnimations();

  // Entrance animations: ripple from center outward (0.04s stagger, scale 0.8 to 1, power3.out, faint white flash)
  useEffect(() => {
    if (!isOpen) return;

    animateTitleReveal(titleCharsRef.current);

    if (clustersAreaRef.current) {
      const tiles = clustersAreaRef.current.querySelectorAll(".hex-tile-container");
      gsap.fromTo(
        tiles,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: VAULT_CONFIG.tileEntranceDuration || 0.65,
          ease: "power3.out",
          stagger: {
            grid: "auto",
            from: "center",
            amount: 0.04 * Math.min(tiles.length, 18),
          },
          delay: 0.2,
          onStart: () => {
            tiles.forEach((t) => t.classList.add("entrance-flash"));
            setTimeout(() => {
              tiles.forEach((t) => t.classList.remove("entrance-flash"));
            }, 500);
          },
        }
      );
    }
  }, [isOpen, animateTitleReveal]);

  // Tab indicator sync
  useEffect(() => {
    if (!tabsNavRef.current || !tabIndicatorRef.current) return;
    const activeBtn = tabsNavRef.current.querySelector<HTMLButtonElement>(
      ".album-filter-chip.active"
    );
    if (activeBtn) {
      animateTabSlide(tabIndicatorRef.current, activeBtn);
    }
  }, [activeFilter, animateTabSlide]);

  // Ambient Canvas Particles (DPR capped at 1.5)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, VAULT_CONFIG.maxDpr);

    const resize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      hue: string;
    }

    const particles: Particle[] = Array.from({ length: 28 }, () => ({
      x: Math.random() * (canvas.width / dpr),
      y: Math.random() * (canvas.height / dpr),
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.25 + 0.1,
      hue: Math.random() > 0.5 ? "#8b5cf6" : "#c4b5fd",
    }));

    const render = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.fillStyle = p.hue;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleTileHover = useCallback((item: VaultItem) => {
    setHoveredCard(item);
  }, []);

  const handleTileLeave = useCallback(() => {
    setHoveredCard(null);
  }, []);

  const handleResetLayout = () => {
    collectionAudio.playPop();
    setSearchQuery("");
    setActiveFilter("all");
    if (clustersAreaRef.current) {
      const state = Flip.getState(clustersAreaRef.current.querySelectorAll(".hex-tile-container"));
      setTimeout(() => {
        Flip.from(state, {
          duration: 0.5,
          ease: "power2.out",
        });
      }, 20);
    }
  };

  const handleTabChange = (val: CertCategory, btn: HTMLButtonElement) => {
    if (clustersAreaRef.current) {
      const state = Flip.getState(clustersAreaRef.current.querySelectorAll(".hex-tile-container"));
      setActiveFilter(val);
      animateTabSlide(tabIndicatorRef.current, btn);
      setTimeout(() => {
        Flip.from(state, {
          duration: 0.45,
          ease: "power2.out",
          fade: true,
          absolute: false,
        });
      }, 10);
    } else {
      setActiveFilter(val);
      animateTabSlide(tabIndicatorRef.current, btn);
    }
  };

  return (
    <div
      ref={containerRef}
      className="cert-vault-stage is-vault-back"
      id="certificate-vault-portal"
      style={{
        scrollMarginTop: "96px",
        paddingTop: "84px", // navbar height (60px) + 24px
        paddingBottom: "120px", // 120px bottom padding so resume button never covers last row
        maxWidth: "1140px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Background Ambience */}
      <div className="vault-ambient-aurora">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
      </div>

      <canvas ref={canvasRef} className="vault-runes-canvas" />

      {/* Constellation Links Overlay */}
      <ConstellationLinks activeCard={hoveredCard} containerRef={containerRef} />

      {/* Hero Header */}
      <header className="album-header-wrap">
        <div className="album-title-controls-row">
          <div className="cert-vault-header-info">
            <div className="cert-vault-eyebrow-row">
              <span className="cert-vault-pulse-dot" />
              <span className="cert-vault-eyebrow">VERIFIED CREDENTIAL VAULT</span>
              <span className="cert-vault-badge-total">
                {CERTIFICATES.length} CREDENTIALS
              </span>
            </div>

            <h2 className="album-main-title" ref={titleCharsRef}>
              <span className="vault-title-mask album-title-cert">
                {"Certificate".split("").map((c, i) => (
                  <span key={i} className="vault-title-char">
                    {c}
                  </span>
                ))}
              </span>
              <span className="vault-title-space">&nbsp;</span>
              <span className="album-title-highlight vault-title-vault vault-title-mask">
                {"Vault".split("").map((c, i) => (
                  <span key={i} className="vault-title-char">
                    {c}
                  </span>
                ))}
              </span>
            </h2>

            <p className="cert-vault-subtitle">
              18 credentials, verified at source.
            </p>
          </div>

          <div className="album-controls-cluster">
            {/* Mascot announcing "unlocked" */}
            <Mascot isExcited={isOpen} />

            <button
              onClick={() => setIsMuted(collectionAudio.toggleMute())}
              className="album-sound-btn"
              type="button"
              aria-label={isMuted ? "Audio muted" : "Audio playing"}
              data-cursor="disable"
            >
              {isMuted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
              <span>{isMuted ? "AUDIO: OFF" : "AUDIO: ON"}</span>
            </button>

            <button
              onClick={onClose}
              className="album-close-btn"
              aria-label="Close Certificate Vault and return to front trigger"
              type="button"
              data-cursor="disable"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Milestone Progress Strip */}
        <MilestoneStrip currentCount={18} totalGoal="25+" />

        {/* Filter Navigation & Search & Reset */}
        <div className="cert-vault-nav-search-row">
          <nav ref={tabsNavRef} className="album-filters-nav" aria-label="Credential filters">
            <div ref={tabIndicatorRef} className="album-tab-indicator" />
            {COLLECTION_FILTERS.map((f) => {
              const count =
                f.value === "all"
                  ? CERTIFICATES.length
                  : CERTIFICATES.filter((c) => c.category === f.value).length;
              return (
                <button
                  key={f.value}
                  onClick={(e) => handleTabChange(f.value, e.currentTarget)}
                  className={`album-filter-chip ${activeFilter === f.value ? "active" : ""}`}
                  type="button"
                  data-cursor="disable"
                >
                  <span>{f.label}</span>
                  <span className="album-chip-count">{count}</span>
                </button>
              );
            })}
          </nav>

          <div className="vault-header-right-tools" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div className="vault-search-box">
              <FiSearch className="vault-search-icon" />
              <input
                type="text"
                placeholder="Search credential, issuer, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="vault-search-input"
                aria-label="Search credentials"
                data-cursor="disable"
              />
            </div>

            <button
              onClick={handleResetLayout}
              className="album-reset-btn"
              type="button"
              aria-label="Reset layout filter and search"
              data-cursor="disable"
            >
              <FiRotateCcw size={13} />
              <span>RESET LAYOUT</span>
            </button>
          </div>
        </div>
      </header>

      {/* Honeycomb Clusters */}
      <main className="vault-domains-container" ref={clustersAreaRef}>
        {filteredClusters.map((cluster) => (
          <DomainCluster
            key={cluster.id}
            cluster={cluster}
            tileShape={VAULT_CONFIG.tileShape || "hex"}
            hoveredItem={hoveredCard}
            searchQuery={searchQuery}
            onTileHover={handleTileHover}
            onTileLeave={handleTileLeave}
          />
        ))}
      </main>
    </div>
  );
};

export default VaultBack;
