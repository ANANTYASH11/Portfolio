import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { TechItem } from "./techData";
import { CollectibleCard } from "../certificates/certificates";
import { collectionAudio } from "../certificates/audio";
import { FiExternalLink, FiDownload } from "react-icons/fi";
import "../styles/vault.css";
import "../certificates/tokens.css";

export type VaultItem = (TechItem | CollectibleCard) & {
  // Common normalized properties
  name?: string;
  title?: string;
  brandColor?: string;
  color?: string;
  isPrimary?: boolean;
  rarity?: string;
  proficiency?: number;
  oneLiner?: string;
  whatIBuilt?: string;
  experience?: string;
  domain?: string;
  issuer?: string;
  date?: string;
  credentialId?: string;
  credentialUrl?: string;
  downloadUrl?: string;
  skills?: { name: string; level: number }[];
  tag?: string;
  number?: string;
  relatedTo?: string[];
  relatedIds?: string[];
  annotation?: string;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties; size?: number; color?: string; strokeWidth?: number }>;
};

export interface HexTileProps {
  item: VaultItem;
  isDimmed: boolean;
  isHighlighted: boolean;
  tileShape?: "hex" | "octagon";
  onHover: (item: VaultItem, elem: HTMLElement | null) => void;
  onLeave: () => void;
}

export const HexTile: React.FC<HexTileProps> = ({
  item,
  isDimmed,
  isHighlighted,
  tileShape = "hex",
  onHover,
  onLeave,
}) => {
  const tileRef = useRef<HTMLButtonElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const isTouchDevice = useRef(false);

  const title = item.name || item.title || "";
  const accentColor = item.brandColor || item.color || "#c4b5fd";
  const isLegendary = item.rarity === "legendary" || item.isPrimary;
  const tagLabel = item.tag || item.number || "";
  const relations = item.relatedTo || item.relatedIds || [];

  // QuickTo helpers for 6deg tilt toward cursor
  const rotXTo = useRef<gsap.QuickToFunc | null>(null);
  const rotYTo = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    isTouchDevice.current =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isTouchDevice.current && !reducedMotion && tileRef.current) {
      rotXTo.current = gsap.quickTo(tileRef.current, "rotationX", {
        duration: 0.28,
        ease: "power2.out",
      });
      rotYTo.current = gsap.quickTo(tileRef.current, "rotationY", {
        duration: 0.28,
        ease: "power2.out",
      });
    }
  }, []);

  // Keyboard navigation when flipped (Esc or Arrow keys)
  useEffect(() => {
    if (!isFlipped) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setIsFlipped(false);
        tileRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped]);

  // Hover: lift 6px, tilt toward cursor (max 6deg via gsap.quickTo)
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isTouchDevice.current || !tileRef.current || isFlipped) return;
    const rect = tileRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = (x / rect.width - 0.5) * 2;
    const yPct = (y / rect.height - 0.5) * 2;

    const maxTilt = 6;
    rotXTo.current?.(-yPct * maxTilt);
    rotYTo.current?.(xPct * maxTilt);

    // Holographic Edge normalized cursor tracking (--mx, --my from -1 to 1)
    tileRef.current.style.setProperty("--mx", `${xPct.toFixed(3)}`);
    tileRef.current.style.setProperty("--my", `${yPct.toFixed(3)}`);
    tileRef.current.style.setProperty("--cursor-x", `${(x / rect.width) * 100}%`);
    tileRef.current.style.setProperty("--cursor-y", `${(y / rect.height) * 100}%`);
  };

  const handleMouseEnter = () => {
    if (tileRef.current) {
      collectionAudio.playPop();
      onHover(item, tileRef.current);

      // Neighbor subtle drift (3px) on adjacent tiles
      const parent = tileRef.current.closest(".honeycomb-grid");
      if (parent) {
        const siblings = parent.querySelectorAll<HTMLElement>(".hex-tile-container");
        siblings.forEach((sib) => {
          if (sib !== tileRef.current) {
            sib.style.setProperty("--drift", "3px");
          }
        });
      }
    }
  };

  const handleMouseLeave = () => {
    if (tileRef.current) {
      rotXTo.current?.(0);
      rotYTo.current?.(0);
      gsap.to(tileRef.current, { y: 0, duration: 0.3, ease: "power2.out" });

      const parent = tileRef.current.closest(".honeycomb-grid");
      if (parent) {
        const siblings = parent.querySelectorAll<HTMLElement>(".hex-tile-container");
        siblings.forEach((sib) => sib.style.removeProperty("--drift"));
      }
    }
    onLeave();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    collectionAudio.playDing();
    setIsFlipped((prev) => !prev);
  };

  const IconComponent = item.icon;

  return (
    <button
      ref={tileRef}
      type="button"
      className={`hex-tile-container shape-${tileShape} ${
        isLegendary ? "is-legendary" : "is-standard"
      } ${isFlipped ? "flipped" : ""} ${isDimmed ? "dimmed" : ""} ${
        isHighlighted ? "highlighted" : ""
      }`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      aria-label={`${title} (${item.issuer || ""}). ${
        relations.length > 0 ? `Related: ${relations.join(", ")}.` : ""
      } Click or press Enter to view credential details.`}
      aria-expanded={isFlipped}
      data-card-id={item.id}
      data-cursor="disable"
    >
      {/* 1px Inner Hairline Contour Layer */}
      <div className="tile-hairline-layer" aria-hidden="true" />

      <div className="hex-flipper">
        {/* ─── FRONT FACE: Glass Crystal Shape ─── */}
        <div className="hex-face hex-face-front">
          {/* Legendary Star Mark */}
          {isLegendary && (
            <span className="hex-star-badge" title="Oracle Certified / Legendary Credential">
              ★
            </span>
          )}

          {/* Cursor Light Sweep */}
          <span className="hex-light-sweep" aria-hidden="true" />

          {/* Card Number (#001/025) in 11px label font */}
          {item.number && (
            <span className="hex-mono-badge">
              {item.number}
            </span>
          )}

          {/* Vibrant Official Brand Color Logo Icon */}
          {IconComponent && (
            <div
              className="hex-icon-wrap"
              style={{
                color: accentColor,
                filter: `drop-shadow(0 2px 8px ${accentColor}55)`,
              }}
              aria-hidden="true"
            >
              <IconComponent size={28} color={accentColor} />
            </div>
          )}

          {/* Two-Line Title */}
          <div className="hex-title">{title}</div>

          {/* Tiny Date Tag */}
          {item.date && (
            <span className="hex-date-tag">{item.date}</span>
          )}

          {/* Tag / Category Pill */}
          {tagLabel && !item.date && <span className="hex-tag-pill">{tagLabel}</span>}
        </div>

        {/* ─── BACK FACE: 3D Flip Technical Details ─── */}
        <div className="hex-face hex-face-back">
          <div className="hex-back-header" style={{ color: accentColor }}>
            {title}
          </div>

          {/* Issuer & Date */}
          {item.issuer && (
            <div className="hex-cert-meta">
              <span className="hex-cert-issuer">{item.issuer}</span>
              {item.date && <span className="hex-cert-date"> · {item.date}</span>}
            </div>
          )}

          {/* Credential ID */}
          {item.credentialId && (
            <div className="hex-back-id-badge">ID: {item.credentialId}</div>
          )}

          {/* Tech stack specific details */}
          {item.oneLiner && <p className="hex-back-desc">{item.oneLiner}</p>}

          {/* Three Skill Bars Filling Smoothly */}
          {item.skills && item.skills.length > 0 && (
            <div className="hex-skills-list">
              {item.skills.slice(0, 3).map((s, idx) => (
                <div key={idx} className="hex-skill-meter">
                  <div className="hex-skill-row">
                    <span className="hex-skill-name">{s.name}</span>
                    <span className="hex-skill-val">{s.level}%</span>
                  </div>
                  <div className="hex-skill-track">
                    <div
                      className="hex-skill-fill"
                      style={{
                        width: isFlipped ? `${s.level}%` : "0%",
                        backgroundColor: accentColor,
                        boxShadow: `0 0 8px ${accentColor}88`,
                        transition: `width 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + idx * 0.08}s`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action buttons: Ghost buttons with underline-draw */}
          <div className="hex-back-actions">
            {item.credentialUrl && (
              <a
                href={item.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hex-ghost-btn"
                onClick={(e) => e.stopPropagation()}
                title="Open credential"
              >
                <FiExternalLink size={12} />
                <span>Open credential</span>
                <span className="ghost-underline-draw" />
              </a>
            )}
            {item.downloadUrl && (
              <a
                href={item.downloadUrl}
                download
                className="hex-ghost-btn"
                onClick={(e) => e.stopPropagation()}
                title="Download document"
              >
                <FiDownload size={12} />
                <span>Download</span>
                <span className="ghost-underline-draw" />
              </a>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default HexTile;
