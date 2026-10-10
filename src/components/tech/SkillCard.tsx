import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { FiX, FiStar, FiZap } from "react-icons/fi";
import { ConstellationData, SkillNode } from "./constellationData";

interface SkillCardProps {
  constellation: ConstellationData | null;
  selectedSkill: SkillNode | null;
  onClose: () => void;
  onSelectSkill: (skill: SkillNode) => void;
}

export const SkillCard: React.FC<SkillCardProps> = ({
  constellation,
  selectedSkill,
  onClose,
  onSelectSkill,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Animate in and out with GSAP
  useEffect(() => {
    if (!constellation || !cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          x: 40,
          scale: 0.96,
          filter: "blur(12px)",
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.45,
          ease: "power3.out",
        }
      );

      // Stagger chips inside card
      gsap.fromTo(
        ".spell-chip",
        { opacity: 0, y: 15, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.03,
          duration: 0.35,
          ease: "back.out(1.5)",
          delay: 0.1,
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, [constellation]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!constellation) return null;

  return (
    <div
      ref={cardRef}
      className="absolute bottom-6 right-6 top-auto z-40 w-full max-w-md sm:bottom-auto sm:top-24 sm:right-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${constellation.category} Skill Details`}
    >
      <div
        className="relative overflow-hidden rounded-2xl p-6 backdrop-blur-2xl shadow-2xl transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, rgba(16, 11, 30, 0.88) 0%, rgba(8, 4, 18, 0.94) 100%)",
          border: `1px solid ${constellation.hue}44`,
          boxShadow: `0 20px 50px rgba(0, 0, 0, 0.65), 0 0 35px ${constellation.hue}22, inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
        }}
      >
        {/* Ambient Top Glow Bar */}
        <div
          className="absolute -top-12 left-1/2 h-24 w-3/4 -translate-x-1/2 rounded-full blur-2xl pointer-events-none"
          style={{ backgroundColor: `${constellation.hue}33` }}
        />

        {/* Header */}
        <div className="relative flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span
              className="flex h-3.5 w-3.5 items-center justify-center rounded-full shadow-lg"
              style={{
                backgroundColor: constellation.hue,
                boxShadow: `0 0 12px ${constellation.hue}`,
              }}
            />
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                {constellation.category}
              </h3>
              <p className="text-xs text-slate-400">
                {constellation.skills.length} Stars Mapped in Constellation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close details (Esc)"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        {/* Selected Skill Spotlight (if clicked) */}
        {selectedSkill && (
          <div
            className="mt-4 rounded-xl p-3.5 transition-all duration-300"
            style={{
              background: `linear-gradient(90deg, ${constellation.hue}18 0%, rgba(255,255,255,0.03) 100%)`,
              border: `1px solid ${constellation.hue}44`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-white"
                  style={{
                    backgroundColor: `${constellation.hue}28`,
                    border: `1px solid ${constellation.hue}66`,
                  }}
                >
                  <selectedSkill.icon />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white">
                      {selectedSkill.name}
                    </h4>
                    {selectedSkill.isPrimary && (
                      <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        <FiZap className="h-2.5 w-2.5" /> Primary
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-slate-400">
                      Proficiency:
                    </span>
                    <div className="flex text-amber-400 text-xs">
                      {Array.from({ length: selectedSkill.level }).map((_, i) => (
                        <FiStar key={i} className="fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {selectedSkill.tag && (
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-slate-300 font-mono">
                  {selectedSkill.tag}
                </span>
              )}
            </div>

            {selectedSkill.relatedIds && selectedSkill.relatedIds.length > 0 && (
              <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="text-violet-400">Linked to:</span>
                <span className="font-mono text-slate-300">
                  {selectedSkill.relatedIds.join(" • ")}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Skill Chips Grid */}
        <div className="mt-4 max-h-64 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-2">
            {constellation.skills.map((skill) => {
              const isSelected = selectedSkill?.id === skill.id;
              const Icon = skill.icon;

              return (
                <button
                  key={skill.id}
                  onClick={() => onSelectSkill(skill)}
                  className={`spell-chip group flex items-center gap-2 rounded-xl p-2.5 text-left transition-all duration-200 ${
                    isSelected
                      ? "ring-1 ring-white/40 bg-white/15"
                      : "bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.06]"
                  }`}
                  style={{
                    borderColor: isSelected ? constellation.hue : undefined,
                  }}
                >
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm text-slate-200 transition-colors group-hover:text-white"
                    style={{
                      backgroundColor: isSelected
                        ? `${constellation.hue}44`
                        : "rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <Icon />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium text-slate-200 group-hover:text-white">
                      {skill.name}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      {skill.tag && <span className="truncate">{skill.tag}</span>}
                      {skill.isPrimary && (
                        <span
                          className="h-1.5 w-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: constellation.hue }}
                        />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer tip */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500">
          <span>Click any star to highlight</span>
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-300">
            Esc to exit flight
          </kbd>
        </div>
      </div>
    </div>
  );
};
