import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  vx: number;
  vy: number;
  color: string;
}

export const CursorOrb: React.FC<{ activeHue?: string }> = ({
  activeHue = "#818cf8",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const orbPos = useRef({ x: -100, y: -100 });
  const particles = useRef<Particle[]>([]);
  const isVisible = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      isVisible.current = true;

      // Spawn star-trail particle on move
      if (Math.random() < 0.45) {
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 2.5 + 1.2,
          alpha: 0.85,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          color: activeHue,
        });
        if (particles.current.length > 30) {
          particles.current.shift();
        }
      }
    };

    const handleMouseLeave = () => {
      isVisible.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      // Lerp orb position
      orbPos.current.x += (mouse.current.x - orbPos.current.x) * 0.22;
      orbPos.current.y += (mouse.current.y - orbPos.current.y) * 0.22;

      if (orbRef.current) {
        orbRef.current.style.transform = `translate3d(${orbPos.current.x}px, ${orbPos.current.y}px, 0)`;
        orbRef.current.style.opacity = isVisible.current ? "1" : "0";
      }

      // Draw star trail particles on canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha *= 0.94; // fade decay

        if (p.alpha < 0.02) {
          particles.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [activeHue]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Star Trail Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />

      {/* Glowing Orb */}
      <div
        ref={orbRef}
        className="pointer-events-none absolute -left-4 -top-4 h-8 w-8 rounded-full transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle, #ffffff 10%, ${activeHue} 55%, transparent 80%)`,
          boxShadow: `0 0 20px ${activeHue}, 0 0 40px ${activeHue}66`,
          willChange: "transform",
        }}
      />
    </div>
  );
};
