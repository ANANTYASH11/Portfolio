import { useEffect, useRef, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";

import Marquee from "react-fast-marquee";

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [displayPercent, setDisplayPercent] = useState(0);
  const animFrameRef = useRef<number>(0);
  const currentRef = useRef(0);

  // Smooth animated counter using requestAnimationFrame
  useEffect(() => {
    const target = percent;
    const animate = () => {
      const diff = target - currentRef.current;
      if (Math.abs(diff) < 0.5) {
        currentRef.current = target;
        setDisplayPercent(target);
        return;
      }
      // Ease towards target — faster when far, slower when close
      currentRef.current += diff * 0.12;
      setDisplayPercent(Math.round(currentRef.current));
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [percent]);

  // Handle load completion
  useEffect(() => {
    if (percent < 100) {
      const fallback = setTimeout(() => {
        setLoaded(true);
        const t2 = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(t2);
      }, 1200);
      return () => clearTimeout(fallback);
    }
    setLoaded(true);
    const t2 = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(t2);
  }, [percent]);

  useEffect(() => {
    if (!isLoaded) return;
    setClicked(true);
    const timer = setTimeout(() => {
      import("./utils/initialFX").then((module) => {
        if (module.initialFX) {
          module.initialFX();
        }
        setIsLoading(false);
      });
    }, 150);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }

  return (
    <>
      <div className="loading-header">
        <a href="/#" className="loader-title" data-cursor="disable">
          Logo
        </a>
        <div className={`loaderGame ${clicked && "loader-out"}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, index) => (
                <div className="loaderGame-line" key={index}></div>
              ))}
            </div>
            <div className="loaderGame-ball"></div>
          </div>
        </div>
      </div>
      <div className={`loading-screen ${clicked ? "loading-exit" : ""}`}>
        {/* Ambient glow orbs */}
        <div className="loading-orb loading-orb-1"></div>
        <div className="loading-orb loading-orb-2"></div>
        <div className="loading-orb loading-orb-3"></div>

        <div className="loading-marquee">
          <Marquee speed={40}>
            <span> A Creative Developer</span> <span>A Creative Designer</span>
            <span> A Creative Developer</span> <span>A Creative Designer</span>
          </Marquee>
        </div>

        {/* Progress bar track */}
        <div className={`loading-progress-track ${clicked ? "progress-hide" : ""}`}>
          <div
            className="loading-progress-fill"
            style={{ width: `${displayPercent}%` }}
          ></div>
        </div>

        <div
          className={`loading-wrap ${clicked && "loading-clicked"}`}
          onMouseMove={(e) => handleMouseMove(e)}
        >
          <div className="loading-hover"></div>
          <div className={`loading-button ${loaded && "loading-complete"}`}>
            <div className="loading-container">
              <div className="loading-content">
                <div className="loading-content-in">
                  Loading <span>{displayPercent}%</span>
                </div>
              </div>
              <div className="loading-box"></div>
            </div>
            <div className="loading-content2">
              <span>Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;

  let interval = setInterval(() => {
    if (percent < 90) {
      let rand = Math.round(Math.random() * 20) + 10;
      percent = Math.min(90, percent + rand);
      setLoading(percent);
    } else {
      clearInterval(interval);
    }
  }, 20);

  function clear() {
    clearInterval(interval);
    percent = 100;
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      percent = 100;
      setLoading(100);
      resolve(100);
    });
  }
  return { loaded, percent, clear };
};
