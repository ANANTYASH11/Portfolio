import { useEffect, useRef } from "react";
import "./styles/Cursor.css";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let hover = false;
    let animId: number;
    const cursor = cursorRef.current;
    if (!cursor) return;

    const mousePos = { x: 0, y: 0 };
    const cursorPos = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const loop = () => {
      if (!hover) {
        const delay = 6;
        cursorPos.x += (mousePos.x - cursorPos.x) / delay;
        cursorPos.y += (mousePos.y - cursorPos.y) / delay;
        cursor.style.transform = `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`;
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    const handleDocMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("a, button, [role='tab'], input, select, textarea, [data-cursor='pointer']");
      if (interactive) {
        cursor.classList.add("cursor-ring-active");
      } else {
        cursor.classList.remove("cursor-ring-active");
      }

      const disabledTarget = target.closest("[data-cursor='disable']");
      if (disabledTarget) {
        cursor.classList.add("cursor-disable");
      } else {
        cursor.classList.remove("cursor-disable");
      }

      const iconsTarget = target.closest("[data-cursor='icons']") as HTMLElement | null;
      if (iconsTarget) {
        const rect = iconsTarget.getBoundingClientRect();
        cursor.classList.add("cursor-icons");
        cursor.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
        cursor.style.setProperty("--cursorH", `${rect.height}px`);
        hover = true;
      } else {
        if (hover) {
          cursor.classList.remove("cursor-icons");
          hover = false;
        }
      }
    };

    document.addEventListener("mouseover", handleDocMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleDocMouseOver);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <div className="cursor-main" ref={cursorRef}></div>;
};

export default Cursor;
