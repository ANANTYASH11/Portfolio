import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface CursorRingProps {
  sectionRef: React.RefObject<HTMLElement>;
}

export const CursorRing: React.FC<CursorRingProps> = ({ sectionRef }) => {
  const ringRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExamining, setIsExamining] = useState(false);

  useEffect(() => {
    // Disable on touch / coarse pointer devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const sectionEl = sectionRef.current;
    const ringEl = ringRef.current;
    if (!sectionEl || !ringEl) return;

    const globalCursor = document.querySelector<HTMLElement>(".cursor-main");

    const quickX = gsap.quickTo(ringEl, "x", { duration: 0.18, ease: "power2.out" });
    const quickY = gsap.quickTo(ringEl, "y", { duration: 0.18, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      quickX(e.clientX);
      quickY(e.clientY);

      // Check if mouse is hovering over the certificate object
      const target = e.target as HTMLElement | null;
      const isOverCert = Boolean(
        target?.closest(".hero-cert-card") || target?.closest(".hero-cert-stage")
      );
      setIsExamining(isOverCert);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
      // Suppress the large global 50px lavender orb while inside Academics
      if (globalCursor) {
        globalCursor.style.opacity = "0";
        globalCursor.style.pointerEvents = "none";
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsExamining(false);
      // Restore the global cursor when leaving Academics
      if (globalCursor) {
        globalCursor.style.opacity = "";
        globalCursor.style.pointerEvents = "";
      }
    };

    sectionEl.addEventListener("mousemove", handleMouseMove, { passive: true });
    sectionEl.addEventListener("mouseenter", handleMouseEnter);
    sectionEl.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      sectionEl.removeEventListener("mousemove", handleMouseMove);
      sectionEl.removeEventListener("mouseenter", handleMouseEnter);
      sectionEl.removeEventListener("mouseleave", handleMouseLeave);
      if (globalCursor) {
        globalCursor.style.opacity = "";
        globalCursor.style.pointerEvents = "";
      }
    };
  }, [sectionRef]);

  // Don't render on touch screens
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <div
      ref={ringRef}
      className={`academic-cursor-ring ${isVisible ? "ring-visible" : "ring-hidden"} ${
        isExamining ? "ring-examining" : ""
      }`}
      aria-hidden="true"
    >
      <div className="ring-inner">
        {isExamining && <span className="ring-label">EXAMINE</span>}
      </div>
    </div>
  );
};

export default CursorRing;
