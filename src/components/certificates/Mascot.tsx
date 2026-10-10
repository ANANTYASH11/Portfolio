import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

interface MascotProps {
  isExcited?: boolean;
}

export const Mascot: React.FC<MascotProps> = ({ isExcited = false }) => {
  const blobRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<SVGCircleElement>(null);
  const rightEyeRef = useRef<SVGCircleElement>(null);
  const [clicked, setClicked] = useState(false);

  // Eye tracking cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!blobRef.current) return;
      const rect = blobRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const maxDistance = 2.5;

      const pupilX = Math.cos(angle) * maxDistance;
      const pupilY = Math.sin(angle) * maxDistance;

      if (leftEyeRef.current) {
        gsap.to(leftEyeRef.current, {
          attr: { cx: 12 + pupilX, cy: 13 + pupilY },
          duration: 0.15,
          ease: "power1.out",
          overwrite: "auto",
        });
      }
      if (rightEyeRef.current) {
        gsap.to(rightEyeRef.current, {
          attr: { cx: 20 + pupilX, cy: 13 + pupilY },
          duration: 0.15,
          ease: "power1.out",
          overwrite: "auto",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSquish = useCallback(() => {
    if (!blobRef.current) return;
    setClicked(true);
    gsap.fromTo(
      blobRef.current,
      { scaleX: 1.25, scaleY: 0.8 },
      {
        scaleX: 1,
        scaleY: 1,
        duration: 0.5,
        ease: "elastic.out(1, 0.4)",
        onComplete: () => setClicked(false),
      }
    );
  }, []);

  useEffect(() => {
    if (isExcited && blobRef.current) {
      handleSquish();
    }
  }, [isExcited, handleSquish]);

  return (
    <div
      ref={blobRef}
      onClick={handleSquish}
      className="cursor-pointer select-none inline-flex items-center gap-2 group transition-transform"
      title="Tap me! I'm your credential mascot."
      role="button"
      tabIndex={0}
      aria-label="Collectible mascot"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleSquish();
      }}
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Playful Yellow Blob Body with Thick White Outline & Pink Shadow */}
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="#FFE45E"
          stroke="#F8F9FA"
          strokeWidth="2"
        />

        {/* Rosy Pink Cheeks */}
        <circle cx="8" cy="18" r="2.5" fill="#FF5CA8" opacity="0.8" />
        <circle cx="24" cy="18" r="2.5" fill="#FF5CA8" opacity="0.8" />

        {/* Eyes */}
        <circle cx="12" cy="13" r="3" fill="#0b0912" />
        <circle cx="20" cy="13" r="3" fill="#0b0912" />

        {/* Pupils (track cursor) */}
        <circle ref={leftEyeRef} cx="12" cy="13" r="1.5" fill="#ffffff" />
        <circle ref={rightEyeRef} cx="20" cy="13" r="1.5" fill="#ffffff" />

        {/* Big Smile Mouth */}
        {isExcited || clicked ? (
          <path
            d="M11 18C11 21.5 13.5 23 16 23C18.5 23 21 21.5 21 18"
            stroke="#0b0912"
            strokeWidth="2"
            strokeLinecap="round"
            fill="#FF5CA8"
          />
        ) : (
          <path
            d="M12 18.5C13.5 20.5 18.5 20.5 20 18.5"
            stroke="#0b0912"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
      </svg>

      <span
        style={{
          fontFamily: "var(--candy-font-hand)",
          fontSize: "17px",
          color: "var(--candy-lemon)",
          fontWeight: 600,
        }}
        className="hidden sm:inline-block"
      >
        {isExcited || clicked ? "new badge unlocked!" : "gotta collect 'em all!"}
      </span>
    </div>
  );
};

export default Mascot;
