import { useEffect, useRef } from "react";
import { COLLECTION_CONFIG } from "./certificates";

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
  count?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  color: string;
  size: number;
  shape: "rect" | "circle";
  alpha: number;
}

const Confetti: React.FC<ConfettiProps> = ({
  active,
  onComplete,
  count = COLLECTION_CONFIG.confettiCount,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas
    const width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    const height = (canvas.height = canvas.offsetHeight || window.innerHeight);

    const colors = [
      COLLECTION_CONFIG.colors.lemon,
      COLLECTION_CONFIG.colors.pink,
      COLLECTION_CONFIG.colors.mint,
      COLLECTION_CONFIG.colors.sky,
      COLLECTION_CONFIG.colors.grape,
    ];

    // Cap particles at 60 for performance
    const actualCount = Math.min(count, 60);
    const particles: Particle[] = [];

    const originX = width / 2;
    const originY = height * 0.45;

    for (let i = 0; i < actualCount; i++) {
      const angle = (Math.PI * 2 * i) / actualCount + (Math.random() - 0.5) * 0.5;
      const speed = 5 + Math.random() * 9;
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4, // initial upward lift
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 7 + Math.random() * 7,
        shape: Math.random() > 0.4 ? "rect" : "circle",
        alpha: 1,
      });
    }

    let animId: number;
    let frame = 0;

    const gravity = 0.28;
    const friction = 0.985;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      let alive = false;
      for (const p of particles) {
        p.vx *= friction;
        p.vy *= friction;
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;

        if (frame > 25) {
          p.alpha -= 0.022;
        }

        if (p.alpha > 0.01) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;

          if (p.shape === "rect") {
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size * 0.6);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      if (alive && frame < 90) {
        animId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
        onComplete?.();
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      ctx.clearRect(0, 0, width, height);
    };
  }, [active, count, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-50 w-full h-full"
      aria-hidden="true"
    />
  );
};

export default Confetti;
