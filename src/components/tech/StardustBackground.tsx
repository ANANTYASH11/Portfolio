import { useEffect, useRef } from "react";

interface StardustBackgroundProps {
  particleCount?: number;
  maxDpr?: number;
  parallaxStrength?: number;
  auroraOpacity?: number;
  isPaused?: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  speedX: number;
  speedY: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

interface AuroraBlob {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
}

export const StardustBackground = ({
  particleCount = 150,
  maxDpr = 1.5,
  parallaxStrength = 0.025,
  auroraOpacity = 0.4,
  isPaused = false,
}: StardustBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let isVisible = true;

    const colors = [
      "rgba(196, 129, 255, ", // violet
      "rgba(168, 85, 247, ",  // purple
      "rgba(0, 240, 255, ",   // cyan
      "rgba(244, 114, 182, ", // fuchsia
      "rgba(255, 255, 255, ", // star white
    ];

    let particles: Particle[] = [];
    const auroraBlobs: AuroraBlob[] = [
      {
        x: 0.25,
        y: 0.3,
        radius: 350,
        vx: 0.0003,
        vy: 0.0002,
        color: "rgba(147, 51, 234, 0.22)", // purple
      },
      {
        x: 0.75,
        y: 0.65,
        radius: 400,
        vx: -0.00025,
        vy: 0.00035,
        color: "rgba(79, 70, 229, 0.2)", // indigo
      },
      {
        x: 0.5,
        y: 0.5,
        radius: 320,
        vx: 0.0002,
        vy: -0.0003,
        color: "rgba(14, 165, 233, 0.16)", // teal / cyan
      },
    ];

    const initParticles = () => {
      particles = [];
      const count = prefersReducedMotion ? 40 : particleCount;
      for (let i = 0; i < count; i++) {
        const baseAlpha = 0.2 + Math.random() * 0.65;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 0.75 + Math.random() * 1.8,
          baseAlpha,
          alpha: baseAlpha,
          speedX: (Math.random() - 0.5) * 0.25,
          speedY: (Math.random() - 0.5) * 0.25 - 0.08, // slow upward drift
          twinkleSpeed: 0.015 + Math.random() * 0.03,
          twinklePhase: Math.random() * Math.PI * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initParticles();
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      const rect = canvas.getBoundingClientRect();
      targetMouseX = (e.clientX - rect.left - width / 2) * parallaxStrength;
      targetMouseY = (e.clientY - rect.top - height / 2) * parallaxStrength;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // IntersectionObserver to pause rendering when section is offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    let time = 0;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      if (!isVisible || isPaused) return;

      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse parallax interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // ─── 1. Aurora Morphs ───
      if (!prefersReducedMotion && auroraOpacity > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.filter = "blur(70px)";

        auroraBlobs.forEach((blob) => {
          blob.x += blob.vx;
          blob.y += blob.vy;
          if (blob.x < 0.1 || blob.x > 0.9) blob.vx *= -1;
          if (blob.y < 0.1 || blob.y > 0.9) blob.vy *= -1;

          const cx = blob.x * width + mouseX * 0.4;
          const cy = blob.y * height + mouseY * 0.4;

          const grad = ctx.createRadialGradient(
            cx,
            cy,
            20,
            cx,
            cy,
            blob.radius
          );
          grad.addColorStop(0, blob.color);
          grad.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, blob.radius, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      // ─── 2. Stardust Particles ───
      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.x += p.speedX;
          p.y += p.speedY;
          p.twinklePhase += p.twinkleSpeed;
          p.alpha =
            p.baseAlpha + Math.sin(p.twinklePhase) * (p.baseAlpha * 0.45);

          // Wrap edges
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
        }

        const renderX = p.x + mouseX;
        const renderY = p.y + mouseY;

        ctx.fillStyle = `${p.color}${Math.max(0, Math.min(1, p.alpha))})`;
        ctx.beginPath();
        ctx.arc(renderX, renderY, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
    };
  }, [particleCount, maxDpr, parallaxStrength, auroraOpacity, isPaused]);

  return (
    <canvas
      ref={canvasRef}
      className="tech-stardust-canvas"
      aria-hidden="true"
    />
  );
};

export default StardustBackground;
