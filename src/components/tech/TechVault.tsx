import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiX, FiSearch } from "react-icons/fi";
import {
  VAULT_CONFIG,
  TechItem,
  DomainId,
  DomainClusterInfo,
  getDomainClusters,
  TECH_VAULT_ITEMS,
} from "./techData";
import DomainCluster from "./DomainCluster";
import "../styles/vault.css";

gsap.registerPlugin(Flip, ScrollTrigger);

interface TechVaultProps {
  isOpen: boolean;
  originCoords: { x: number; y: number } | null;
  onClose: () => void;
}

interface ConnectionLine {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

export const TechVault: React.FC<TechVaultProps> = ({
  isOpen,
  originCoords,
  onClose,
}) => {
  const portalRef = useRef<HTMLDivElement>(null);
  const shockwaveRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleCharsRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);

  const [activeDomain, setActiveDomain] = useState<"all" | DomainId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredItem, setHoveredItem] = useState<TechItem | null>(null);
  const [connectionLines, setConnectionLines] = useState<ConnectionLine[]>([]);
  const [animatedTechCount, setAnimatedTechCount] = useState(0);

  const clusters = useMemo(() => getDomainClusters(), []);
  const allItems = useMemo(() => TECH_VAULT_ITEMS, []);

  // Filter clusters by selected domain tab
  const filteredClusters = useMemo(() => {
    if (activeDomain === "all") return clusters;
    return clusters.filter((c: DomainClusterInfo) => c.id === activeDomain);
  }, [clusters, activeDomain]);

  // ─── AMBIENT RUNES CANVAS (DPR capped at 1.5) ───
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, VAULT_CONFIG.maxDpr);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Floating runes characters
    const runes = ["◇", "◈", "◆", "✦", "▲", "▼", "⚛", "λ", "0", "1", "π", "∑", "∫"];
    const particles = Array.from({ length: 28 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      char: runes[Math.floor(Math.random() * runes.length)],
      size: 10 + Math.random() * 14,
      speedY: -0.2 - Math.random() * 0.4,
      speedX: (Math.random() - 0.5) * 0.3,
      alpha: 0.1 + Math.random() * 0.25,
      hue: Math.random() > 0.5 ? "#a855f7" : "#06b6d4",
    }));

    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < -20) p.y = window.innerHeight + 20;
        if (p.x < -20) p.x = window.innerWidth + 20;
        if (p.x > window.innerWidth + 20) p.x = -20;

        ctx.font = `${p.size}px monospace`;
        ctx.fillStyle = p.hue;
        ctx.globalAlpha = p.alpha;
        ctx.fillText(p.char, p.x, p.y);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [isOpen]);

  // ─── STEP 2: THE PORTAL OPENING ANIMATION (GSAP 0.9s power4.inOut) ───
  useEffect(() => {
    if (!isOpen || !portalRef.current) return;

    const overlay = portalRef.current;
    const shockwave = shockwaveRef.current;

    const originX = originCoords?.x ?? window.innerWidth / 2;
    const originY = originCoords?.y ?? window.innerHeight / 2;

    overlay.style.setProperty("--portal-origin-x", `${originX}px`);
    overlay.style.setProperty("--portal-origin-y", `${originY}px`);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const unlockScroll = () => {
      document.body.style.overflow = "";
      document.body.style.overflowY = "auto";
      document.documentElement.style.overflow = "";
      document.documentElement.style.overflowY = "auto";
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 50);
    };

    // Body scroll lock while vault is open
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    if (prefersReducedMotion) {
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      setAnimatedTechCount(41);
      return () => {
        unlockScroll();
      };
    }

    const tl = gsap.timeline();

    // 1. Shockwave ring
    if (shockwave) {
      tl.fromTo(
        shockwave,
        { scale: 0.5, opacity: 0.9 },
        {
          scale: 40,
          opacity: 0,
          duration: VAULT_CONFIG.shockwaveDuration,
          ease: "power3.out",
        },
        0
      );
    }

    // 2. Circular clip-path expansion
    tl.fromTo(
      overlay,
      {
        clipPath: `circle(0px at ${originX}px ${originY}px)`,
        opacity: 0.8,
      },
      {
        clipPath: `circle(160% at ${originX}px ${originY}px)`,
        opacity: 1,
        duration: 0.75,
        ease: VAULT_CONFIG.portalEase,
      },
      0
    );

    // 3. Heading split letter-by-letter reveal
    if (titleCharsRef.current) {
      const chars = titleCharsRef.current.querySelectorAll(".vault-char");
      if (chars.length > 0) {
        tl.fromTo(
          chars,
          {
            yPercent: 120,
            rotate: 8,
            opacity: 0,
          },
          {
            yPercent: 0,
            rotate: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.02,
            ease: "expo.out",
          },
          0.25
        );
      }
    }

    // 4. Subtitle + count ticker
    const tickerVal = { count: 0 };
    tl.to(
      tickerVal,
      {
        count: 41,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: () => setAnimatedTechCount(Math.round(tickerVal.count)),
      },
      0.45
    );

    // 5. Honeycomb tiles ignite in a ripple wave from center outward
    const tiles = overlay.querySelectorAll(".hex-tile-container");
    if (tiles.length > 0) {
      tl.fromTo(
        tiles,
        {
          scale: 0,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: VAULT_CONFIG.tileEntranceDuration,
          ease: "back.out(1.6)",
          stagger: {
            grid: "auto",
            from: "center",
            amount: 0.45,
          },
        },
        0.5
      );
    }

    return () => {
      unlockScroll();
    };
  }, [isOpen, originCoords]);

  // ─── REVERSE PORTAL ON CLOSE ───
  const handlePortalClose = useCallback(() => {
    if (!portalRef.current) {
      onClose();
      return;
    }

    const overlay = portalRef.current;
    const originX = originCoords?.x ?? window.innerWidth / 2;
    const originY = originCoords?.y ?? window.innerHeight / 2;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      onClose();
      return;
    }

    gsap.to(overlay, {
      clipPath: `circle(0px at ${originX}px ${originY}px)`,
      opacity: 0,
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        onClose();
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 50);
      },
    });
  }, [onClose, originCoords]);

  // ─── ESC KEY LISTENER & FOCUS TRAP ───
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handlePortalClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handlePortalClose]);

  // ─── STEP 5: GSAP FLIP FOR DOMAIN FILTERING ───
  const handleDomainFilter = (domain: "all" | DomainId) => {
    if (!contentAreaRef.current) {
      setActiveDomain(domain);
      return;
    }

    const cards = contentAreaRef.current.querySelectorAll(".domain-cluster-card");
    const state = Flip.getState(cards);

    setActiveDomain(domain);

    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.5,
        ease: "power2.out",
        scale: true,
        fade: true,
      });
    });
  };

  // ─── STEP 4: RELATED TECH GLOWING SVG CONNECTION LINES ───
  const handleTileHover = (item: any, elem: HTMLElement | null) => {
    setHoveredItem(item as TechItem);

    if (!elem || !portalRef.current) {
      setConnectionLines([]);
      return;
    }

    const startRect = elem.getBoundingClientRect();
    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;

    const lines: ConnectionLine[] = [];

    (item.relatedIds || []).forEach((relatedId: string) => {
      const relatedItem = allItems.find((it: TechItem) => it.id === relatedId);
      if (!relatedItem) return;

      const targetButtons = portalRef.current?.querySelectorAll(
        `[aria-label^="${relatedItem.name}"]`
      );
      if (targetButtons && targetButtons.length > 0) {
        const targetRect = targetButtons[0].getBoundingClientRect();
        lines.push({
          id: `${item.id}-${relatedId}`,
          x1: startX,
          y1: startY,
          x2: targetRect.left + targetRect.width / 2,
          y2: targetRect.top + targetRect.height / 2,
          color: item.brandColor || "#c2a4ff",
        });
      }
    });

    setConnectionLines(lines);
  };

  const handleTileLeave = () => {
    setHoveredItem(null);
    setConnectionLines([]);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Shockwave expanding ring */}
      <div
        ref={shockwaveRef}
        className="portal-shockwave-ring"
        style={{
          left: originCoords?.x ?? window.innerWidth / 2,
          top: originCoords?.y ?? window.innerHeight / 2,
        }}
      />

      {/* Fullscreen Cybernetic Obsidian Stage */}
      <div
        ref={portalRef}
        className="vault-portal-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="The Tech Vault - Hexagonal Core Infrastructure"
        tabIndex={-1}
      >
        {/* Ambient Canvas Runes */}
        <canvas ref={canvasRef} className="vault-runes-canvas" />

        {/* Ambient Aurora Violet/Cyan Blobs */}
        <div className="vault-ambient-aurora">
          <div className="aurora-blob aurora-blob-1" />
          <div className="aurora-blob aurora-blob-2" />
        </div>

        {/* SVG Dynamic Glowing Connection Lines between Related Tech */}
        {connectionLines.length > 0 && (
          <svg className="vault-connections-svg">
            {connectionLines.map((line) => (
              <line
                key={line.id}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={line.color}
                strokeWidth={2.5}
                className="vault-connection-line"
              />
            ))}
          </svg>
        )}

        {/* Close Button Top Right */}
        <button
          type="button"
          className="vault-close-btn"
          onClick={handlePortalClose}
          aria-label="Close Tech Vault"
          data-cursor="disable"
        >
          <FiX />
        </button>

        {/* ─── VAULT HEADER ─── */}
        <header className="vault-header">
          <div className="vault-eyebrow-pill">
            <span className="vault-pulse-dot" />
            <span>HEXAGONAL CORE INFRASTRUCTURE</span>
          </div>

          <h1 className="vault-main-title" ref={titleCharsRef}>
            {"THE TECH VAULT".split("").map((char, index) => (
              <span key={index} className="vault-char">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>

          <p className="vault-subtitle" ref={subtitleRef}>
            <strong>{animatedTechCount || 41} TECHNOLOGIES</strong> · 6
            ENGINEERING DOMAINS
          </p>

          {/* ─── DOMAIN FILTER PILLS & SEARCH BAR ─── */}
          <div className="vault-nav-search-row">
            <nav className="vault-domain-tabs" aria-label="Technology Domains">
              <button
                type="button"
                className={`domain-tab-btn ${
                  activeDomain === "all" ? "active" : ""
                }`}
                onClick={() => handleDomainFilter("all")}
                data-cursor="disable"
              >
                <span>All</span>
                <span className="tab-count-chip">{allItems.length}</span>
              </button>

              {clusters.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`domain-tab-btn ${
                    activeDomain === c.id ? "active" : ""
                  }`}
                  onClick={() => handleDomainFilter(c.id)}
                  data-cursor="disable"
                >
                  <span
                    className="domain-tab-dot"
                    style={{ backgroundColor: c.hue }}
                  />
                  <span>{c.name.split(" ")[0]}</span>
                  <span className="tab-count-chip">{c.items.length}</span>
                </button>
              ))}
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

        {/* ─── DOMAIN CLUSTERS CONTAINER ─── */}
        <main className="vault-domains-container" ref={contentAreaRef}>
          {filteredClusters.map((cluster: DomainClusterInfo) => (
            <DomainCluster
              key={cluster.id}
              cluster={cluster}
              hoveredItem={hoveredItem}
              searchQuery={searchQuery}
              onTileHover={handleTileHover}
              onTileLeave={handleTileLeave}
            />
          ))}
        </main>
      </div>
    </>
  );
};

export default TechVault;
