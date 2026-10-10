import React, { useRef, useState, useMemo, useEffect, useCallback } from "react";
import gsap from "gsap";
import {
  FiX,
  FiVolume2,
  FiVolumeX,
  FiCheckCircle,
  FiCpu,
  FiRotateCcw,
  FiSearch,
} from "react-icons/fi";
import {
  VAULT_CONFIG,
  DomainId,
  DomainClusterInfo,
  getDomainClusters,
  TECH_VAULT_ITEMS,
} from "./techData";
import DomainCluster from "./DomainCluster";
import { VaultItem } from "./HexTile";
import Mascot from "../certificates/Mascot";
import { collectionAudio } from "../certificates/audio";
import { useVaultAnimations } from "../certificates/useVaultAnimations";
import "../certificates/tokens.css";
import "../styles/vault.css";

interface TechVaultBackProps {
  isOpen: boolean;
  onClose: () => void;
}

const TECH_DOMAIN_FILTERS: { label: string; value: "all" | DomainId }[] = [
  { label: "All Tech", value: "all" },
  { label: "Languages", value: "languages" },
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Databases", value: "databases" },
  { label: "Systems", value: "systems" },
  { label: "AI & Cloud", value: "ai_cloud" },
];

export const TechVaultBack: React.FC<TechVaultBackProps> = ({ isOpen, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleCharsRef = useRef<HTMLHeadingElement>(null);
  const pillCountRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const ratioRef = useRef<HTMLSpanElement>(null);
  const tabsNavRef = useRef<HTMLElement>(null);
  const tabIndicatorRef = useRef<HTMLDivElement>(null);
  const clustersAreaRef = useRef<HTMLDivElement>(null);

  const [activeDomain, setActiveDomain] = useState<"all" | DomainId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredItem, setHoveredItem] = useState<VaultItem | null>(null);
  const [connectionLines, setConnectionLines] = useState<
    { id: string; x1: number; y1: number; x2: number; y2: number; color: string }[]
  >([]);
  const [isMuted, setIsMuted] = useState(() => collectionAudio.isMuted());

  const clusters = useMemo(() => getDomainClusters(), []);
  const allItems = useMemo(() => TECH_VAULT_ITEMS, []);

  const filteredClusters = useMemo(() => {
    if (activeDomain === "all") return clusters;
    return clusters.filter((c: DomainClusterInfo) => c.id === activeDomain);
  }, [clusters, activeDomain]);

  const {
    animateTitleReveal,
    animateOdometer,
    animateProgressBar,
    animateTabSlide,
  } = useVaultAnimations();

  // Entrance animations
  useEffect(() => {
    if (!isOpen) return;

    animateTitleReveal(titleCharsRef.current);
    animateOdometer(pillCountRef.current, allItems.length, " TECHNOLOGIES");
    animateProgressBar(
      progressBarRef.current,
      100,
      ratioRef.current,
      allItems.length,
      `${allItems.length}`
    );

    if (clustersAreaRef.current) {
      const tiles = clustersAreaRef.current.querySelectorAll(".hex-tile-container");
      gsap.fromTo(
        tiles,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: VAULT_CONFIG.tileEntranceDuration,
          ease: "back.out(1.6)",
          stagger: { grid: "auto", from: "center", amount: 0.45 },
          delay: 0.35,
        }
      );
    }
  }, [isOpen, allItems.length, animateTitleReveal, animateOdometer, animateProgressBar]);

  // Tab indicator sync
  useEffect(() => {
    if (!tabsNavRef.current || !tabIndicatorRef.current) return;
    const activeBtn = tabsNavRef.current.querySelector<HTMLButtonElement>(
      ".album-filter-chip.active"
    );
    if (activeBtn) {
      animateTabSlide(tabIndicatorRef.current, activeBtn);
    }
  }, [activeDomain, animateTabSlide]);

  // Ambient Canvas Runes / Particles
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

    const runes = ["◇", "◈", "◆", "✦", "▲", "▼", "⚛", "λ", "0", "1", "π", "∑", "∫"];
    const particles = Array.from({ length: 28 }, () => ({
      x: Math.random() * (canvas.width / dpr),
      y: Math.random() * (canvas.height / dpr),
      char: runes[Math.floor(Math.random() * runes.length)],
      size: 10 + Math.random() * 12,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -0.2 - Math.random() * 0.3,
      alpha: 0.12 + Math.random() * 0.2,
      hue: Math.random() > 0.5 ? "#c2a4ff" : "#00f0ff",
    }));

    const render = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < -20) p.y = h + 20;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;

        ctx.font = `${p.size}px monospace`;
        ctx.fillStyle = p.hue;
        ctx.globalAlpha = p.alpha;
        ctx.fillText(p.char, p.x, p.y);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Related tech SVG connections
  const handleTileHover = useCallback((item: VaultItem, elem: HTMLElement | null) => {
    setHoveredItem(item);
    if (!elem || !containerRef.current) {
      setConnectionLines([]);
      return;
    }

    const stageRect = containerRef.current.getBoundingClientRect();
    const startRect = elem.getBoundingClientRect();
    const startX = startRect.left - stageRect.left + startRect.width / 2;
    const startY = startRect.top - stageRect.top + startRect.height / 2;

    const lines: { id: string; x1: number; y1: number; x2: number; y2: number; color: string }[] = [];

    (item.relatedIds || []).forEach((relId: string) => {
      const relTech = allItems.find((t) => t.id === relId);
      if (!relTech) return;

      const target = containerRef.current?.querySelector<HTMLElement>(
        `[aria-label^="${relTech.name}"]`
      );
      if (target) {
        const tRect = target.getBoundingClientRect();
        lines.push({
          id: `${item.id}-${relId}`,
          x1: startX,
          y1: startY,
          x2: tRect.left - stageRect.left + tRect.width / 2,
          y2: tRect.top - stageRect.top + tRect.height / 2,
          color: item.brandColor || item.color || "#c2a4ff",
        });
      }
    });

    setConnectionLines(lines);
  }, [allItems]);

  return (
    <div
      ref={containerRef}
      className="cert-vault-stage album-paper-grid is-vault-back"
      id="tech-vault-portal"
    >
      <div className="vault-ambient-aurora">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
      </div>

      <canvas ref={canvasRef} className="vault-runes-canvas" />

      {connectionLines.length > 0 && (
        <svg className="vault-connections-svg">
          {connectionLines.map((l) => (
            <line
              key={l.id}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke={l.color}
              strokeWidth={2.5}
              className="vault-connection-line"
            />
          ))}
        </svg>
      )}

      {/* Hero Header */}
      <header className="album-header-wrap">
        <div className="album-title-controls-row">
          <div className="cert-vault-header-info">
            <div className="cert-vault-eyebrow-row">
              <span className="cert-vault-pulse-dot" />
              <span className="cert-vault-eyebrow">HEXAGONAL CORE INFRASTRUCTURE</span>
              <span ref={pillCountRef} className="cert-vault-badge-total">
                {allItems.length} TECHNOLOGIES
              </span>
            </div>

            <h2 className="album-main-title" ref={titleCharsRef}>
              <span className="vault-title-mask album-title-cert">
                {"Tech".split("").map((c, i) => (
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
              Architectural index of programming languages, frontend/backend frameworks,
              distributed databases, and cloud engineering infrastructure.
            </p>
          </div>

          <div className="album-controls-cluster">
            <Mascot isExcited={isOpen} />

            <button
              onClick={() => setIsMuted(collectionAudio.toggleMute())}
              className="album-sound-btn"
              type="button"
              data-cursor="disable"
            >
              {isMuted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
              <span>{isMuted ? "AUDIO: OFF" : "AUDIO: ON"}</span>
            </button>

            <button
              onClick={onClose}
              className="album-close-btn"
              aria-label="Close Tech Vault"
              type="button"
              data-cursor="disable"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Status Strip */}
        <div className="cert-vault-meta-bar">
          <div className="cert-vault-status-pill">
            <FiCpu size={14} />
            <span>100% PRODUCTION READY · SCALABLE MICROSERVICES</span>
          </div>

          <div className="cert-vault-progress-wrap">
            <div className="progress-label-row">
              <span className="progress-label-text">
                <FiCheckCircle size={12} /> ALL TECH NODES VERIFIED
              </span>
              <span ref={ratioRef} className="progress-ratio">
                41 / 41 AVAILABLE
              </span>
            </div>
            <div className="album-xp-outer-bar">
              <div
                ref={progressBarRef}
                className="album-xp-fill-bar"
                style={{ width: "100%" }}
              >
                <span className="vault-progress-rider">✦</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              collectionAudio.playPop();
              setSearchQuery("");
            }}
            className="album-reset-btn"
            type="button"
            data-cursor="disable"
          >
            <FiRotateCcw size={13} />
            <span>RESET LAYOUT</span>
          </button>
        </div>

        {/* Filter Navigation & Search */}
        <div className="cert-vault-nav-search-row">
          <nav ref={tabsNavRef} className="album-filters-nav">
            <div ref={tabIndicatorRef} className="album-tab-indicator" />
            {TECH_DOMAIN_FILTERS.map((f) => {
              const count =
                f.value === "all"
                  ? allItems.length
                  : allItems.filter((t) => t.domain === f.value).length;
              return (
                <button
                  key={f.value}
                  onClick={(e) => {
                    setActiveDomain(f.value);
                    animateTabSlide(tabIndicatorRef.current, e.currentTarget);
                  }}
                  className={`album-filter-chip ${activeDomain === f.value ? "active" : ""}`}
                  type="button"
                  data-cursor="disable"
                >
                  <span>{f.label}</span>
                  <span className="album-chip-count">{count}</span>
                </button>
              );
            })}
          </nav>

          <div className="vault-search-box">
            <FiSearch className="vault-search-icon" />
            <input
              type="text"
              placeholder="Search tech, stack, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="vault-search-input"
              data-cursor="disable"
            />
          </div>
        </div>
      </header>

      {/* Honeycomb Clusters */}
      <main className="vault-domains-container" ref={clustersAreaRef}>
        {filteredClusters.map((cluster) => (
          <DomainCluster
            key={cluster.id}
            cluster={cluster}
            hoveredItem={hoveredItem}
            searchQuery={searchQuery}
            onTileHover={handleTileHover}
            onTileLeave={() => {
              setHoveredItem(null);
              setConnectionLines([]);
            }}
          />
        ))}
      </main>
    </div>
  );
};

export default TechVaultBack;
